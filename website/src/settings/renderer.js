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

    store.set(key, parsedValue)
        .then(async (res) => {
            await displaySettings(key);
            if (JSON.stringify(parsedValue) == JSON.stringify(res)) {
                alert(`设置 ${key} 成功.`);
            } else throw new Error(`设置结果与期望值不符 (可能是自动补全): \n\n期望: \n${JSON.stringify(parsedValue)}\n\n结果: \n${JSON.stringify(res)}`);
        })
        .catch((err) => {
            alert(`设置 ${key} 失败: \n\n${err.message}`);
        });
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
            p.textContent = `${key}=${value}`;
            outputDiv.appendChild(p);
        }
    });
}

async function onSelectChange() {
    const key = document.getElementById('settingKey').value;
    const value = await store.get(key);
    document.getElementById('settingValue').value = typeof value == 'string' ? value : JSON.stringify(value);
}

async function onResetClick() {
    const key = document.getElementById('settingKey').value;
    try {
        await store.reset(key);
        alert(`重置 ${key} 成功.`);
    } catch (err) {
        console.error(err);
        alert(`重置 ${key} 失败: \n\n${err.message}`);
    } finally {
        await displaySettings(key);
    }
}

displaySettings();
