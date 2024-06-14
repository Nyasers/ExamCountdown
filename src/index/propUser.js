import { ec } from './ec.js';

export const propUser = {};

propUser.background = {
    value: 'file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg',
    /**
    * @param {string} value 
    */
    func: function (value) {
        ec.properties.user.background.value = value;
        ec.background.set(ec.properties.user.background.value);
    }
};
propUser.breakon = {
    value: '高考',
    /**
    * @param {string} value 
    */
    func: function (value) {
        ec.properties.user.breakon.value = value;
        ec.exam.build(ec.properties.user.breakon.value);
    }
};
propUser.finalonly = {
    value: false,
    /**
    * @param {boolean} value 
    */
    func: function (value) {
        ec.properties.user.finalonly.value = value;
        ec.exam.build();
    }
};
propUser.hitokoto = {
    value: true,
    /**
    * @param {boolean} value 
    */
    func: function (value) {
        ec.properties.user.hitokoto.value = value;
    }
};
propUser.bingwallpaper = {
    value: true,
    /**
     * @param {boolean} value 
     */
    func: async function (value) {
        ec.properties.user.bingwallpaper.value = value;
        if (ec.online) {
            if (ec.properties.user.bingwallpaper.value)
                ec.background.set(await ec.plugin.bingWallpaper.fetch());
            else
                ec.background.set(ec.properties.user.background.value);
        }
    }
};
propUser.extraexams = {
    value: 'https://ec.nyase.ru/extraexams.json',
    /**
    * @param {string} value 
    */
    func: function (value) {
        ec.properties.user.extraexams.value = value;
        if (ec.online)
            ec.exam.extra.fetch(ec.properties.user.extraexams.value);

        else
            ec.exam.extra.url = ec.properties.user.extraexams.value;
    }
};

export function applyUserProperties(properties) {
    const ec = globalThis.ec;
    if (properties.background) {
        ec.properties.user.background.func(`file:///${properties.background.value}`);
    }
    if (properties.breakon) {
        ec.properties.user.breakon.func(properties.breakon.value);
    }
    if (properties.finalonly) {
        ec.properties.user.finalonly.func(properties.finalonly.value);
    }
    if (properties.hitokoto) {
        ec.properties.user.hitokoto.func(properties.hitokoto.value);
    }
    if (properties.bingwallpaper) {
        ec.properties.user.bingwallpaper.func(properties.bingwallpaper.value);
    }
    if (properties.extraexams) {
        ec.properties.user.extraexams.func(properties.extraexams.value);
    }
}

