use std::env::current_dir;
use std::fs::File;
use std::io::Read;
use tauri::{generate_context, AppHandle, Manager};
use tauri_plugin_autostart::MacosLauncher;
use winreg::enums::HKEY_CURRENT_USER;
use winreg::RegKey;

#[tauri::command]
fn is_installed() -> Result<bool, String> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let key = hkcu
        .open_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\ExamCountdown")
        .map_err(|e| format!("打开注册表项失败: {}", e))?;

    let install_path: String = key
        .get_value("InstallLocation")
        .map_err(|e| format!("读取 InstallLocation 值失败: {}", e))?;

    let current_path = format!("\"{}\"", current_dir().unwrap().display().to_string());

    let installed: bool = install_path == current_path;
    Ok(installed)
}

#[tauri::command]
fn get_wallpaper_data() -> Result<Vec<u8>, String> {
    // 打开注册表项
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let key = hkcu
        .open_subkey("Control Panel\\Desktop")
        .map_err(|e| format!("打开注册表项失败: {}", e))?;

    // 读取 Wallpaper 值
    let wallpaper_path: String = key
        .get_value("Wallpaper")
        .map_err(|e| format!("读取 Wallpaper 值失败: {}", e))?;

    // 读取图片文件
    let mut file = File::open(&wallpaper_path).map_err(|e| format!("打开图片文件失败: {}", e))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)
        .map_err(|e| format!("读取图片文件内容失败: {}", e))?;

    Ok(buffer)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = show_window(app);
        }))
        .plugin(tauri_plugin_wallpaper::init())
        .invoke_handler(tauri::generate_handler![is_installed, get_wallpaper_data])
        .setup(|app| {
            #[cfg(debug_assertions)] // 仅在调试构建时包含此代码
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools(); // 打开开发者工具
                                        // window.close_devtools();
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(generate_context!())
        .expect("error while running tauri application");
}

fn show_window(app: &AppHandle) {
    let windows = app.webview_windows();

    windows
        .values()
        .next()
        .expect("Sorry, no window found")
        .set_focus()
        .expect("Can't Bring Window to Focus");
}
