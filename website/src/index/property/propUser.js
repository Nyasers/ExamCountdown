import { ec } from '../ec.js';
export const propUser = {};

propUser.background = {
    value: 'file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg',
    func: (
        /**
        * @param {string} value 
        */
        function (value) {
            this.background.value = value;
            ec.background.set(this.background.value);
        }
    ).bind(propUser)
};
propUser.breakon = {
    value: '高考',
    func: (
        /**
        * @param {string} value 
        */
        function (value) {
            this.breakon.value = value;
            ec.exam.build(this.breakon.value);
        }
    ).bind(propUser)
};
propUser.finalonly = {
    value: false,
    func: (
        /**
        * @param {boolean} value 
        */
        function (value) {
            this.finalonly.value = value;
            ec.exam.build();
        }
    ).bind(propUser)
};
propUser.hitokoto = {
    value: true,
    func: (
        /**
        * @param {boolean} value 
        */
        function (value) {
            this.hitokoto.value = value;
        }
    ).bind(propUser)
};
propUser.bingwallpaper = {
    value: true,
    func: (
        /**
         * @param {boolean} value 
         */
        async function (value) {
            this.bingwallpaper.value = value;
            if (ec.online) {
                if (this.bingwallpaper.value)
                    ec.background.set(await ec.plugin.bingWallpaper.fetch());
                else
                    ec.background.set(this.background.value);
            }
        }
    ).bind(propUser)
};
propUser.extraexams = {
    value: 'https://ec.nyase.ru/extraexams.json',
    func: (
        /**
        * @param {string} value  
        */
        function (value) {
            this.extraexams.value = value;
            if (ec.online)
                ec.exam.extra.fetch(this.extraexams.value);

            else
                ec.exam.extra.url = this.extraexams.value;
        }
    ).bind(propUser)
};

export const applyUserProperties = (function (properties) {
    if (properties.background)
        this.background.func(`file:///${properties.background.value}`);
    if (properties.breakon)
        this.breakon.func(properties.breakon.value);
    if (properties.finalonly)
        this.finalonly.func(properties.finalonly.value);
    if (properties.hitokoto)
        this.hitokoto.func(properties.hitokoto.value);
    if (properties.bingwallpaper)
        this.bingwallpaper.func(properties.bingwallpaper.value);
    if (properties.extraexams)
        this.extraexams.func(properties.extraexams.value);
}).bind(propUser);
