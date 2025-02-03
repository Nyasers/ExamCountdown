import { ec } from '../ec.js';
export const propUser = {};

propUser.apply = (function (config) {
    if (config.text) this.text.func(config.text)
    if (config.exams) this.exams.func(config.exams)
    if (config.breakon) this.breakon.func(config.breakon)
    if (config.hitokoto) this.hitokoto.func(config.hitokoto)
    if (config.finalonly) this.finalonly.func(config.finalonly)
    if (config.bingwallpaper) this.bingwallpaper.func(config.bingwallpaper)
}).bind(propUser);

propUser.exams = {
    value: [{
        title: "福建高考",
        time: {
            start: "$YYYY/06/07 09:00",
            end: "$YYYY/06/09 18:15",
        },
        top: false,
    }],
    func: (
        /**
        * @param {Array<Object>} value
        */
        function (value) {
            this.exams.value = value;
            ec.exam.build(this.breakon.value);
        }
    ).bind(propUser)
};
propUser.text = {
    value: {
        start: '距离 {0} <strong>仅剩</strong>',
        ending: '距离 {0} 结束还有',
        time: '{0} ~ {1} 天 ~ {2} 小时 ~ {3} 秒',
    },
    func: (
        /**
        * @param {Object} value 
        */
        function (value) {
            this.text.value = value;
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