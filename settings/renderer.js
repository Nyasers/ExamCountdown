const store = window.electronStore;

document.getElementById('settingsForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const key = document.getElementById('settingKey').value;
    const value = document.getElementById('settingValue').value;

    // 尝试将值转换为适当的类型
    let parsedValue;
    try {
        parsedValue = JSON.parse(value);
    } catch (e) {
        parsedValue = value; // 如果解析失败，则保持为字符串
    }

    console.log(parsedValue == await store.set(key, parsedValue))
    await displaySettings(key);
});

async function displaySettings(skey = null) {
    const select = document.getElementById('settingKey');
    const outputDiv = document.getElementById('output');
    select.innerHTML = outputDiv.innerHTML = '';

    const keys = Object.keys(await store.get());

    if (skey == null || !store.has(skey))
        skey = keys[0];

    keys.forEach(async (key) => {
        if (store.has(key)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            select.appendChild(option);
            if (key == skey) {
                option.selected = true;
                await onSelectChange();
            }

            const value = JSON.stringify(await store.get(key));
            const p = document.createElement('p');
            p.textContent = `${key}: ${value}`;
            outputDiv.appendChild(p);
        }
    });
}

async function onSelectChange() {
    const select = document.getElementById('settingKey');
    const key = select.value;
    const value = await store.get(key);
    document.getElementById('settingValue').value = JSON.stringify(value);
}

displaySettings();
