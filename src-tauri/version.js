const fs = require('fs');
const toml = require('@iarna/toml');
const path = require('path');

// 配置文件路径
const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const tauriConfJsonPath = path.resolve(__dirname, 'tauri.conf.json');
const cargoTomlPath = path.resolve(__dirname, 'Cargo.toml');

// 读取 package.json 中的版本号
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// 更新 tauri.conf.json
const tauriConfJson = JSON.parse(fs.readFileSync(tauriConfJsonPath, 'utf8'));
// 假设 version 在 tauri.conf.json 中的路径为 version
tauriConfJson.version = version;
fs.writeFileSync(tauriConfJsonPath, JSON.stringify(tauriConfJson, null, 2));

// 更新 Cargo.toml
const cargoToml = toml.parse(fs.readFileSync(cargoTomlPath, 'utf8'));
// 假设 version 在 Cargo.toml 中的路径为 package.version
cargoToml.package.version = version;
fs.writeFileSync(cargoTomlPath, toml.stringify(cargoToml));
