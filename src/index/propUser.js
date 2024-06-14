import { ec } from './ec.js';

export const propUser = {};

propUser.background = {
    value: 'file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg',
    func: function (value) {
        ec.properties.background.value = value;
        ec.background.set(ec.properties.background.value);
    }
};
propUser.breakon = {
    value: '高考',
    func: function (value) {
        ec.properties.breakon.value = value;
        ec.exam.build(ec.properties.breakon.value);
    }
};
propUser.finalonly = {
    value: false,
    func: function (value) {
        ec.properties.finalonly.value = value;
        ec.exam.build();
    }
};
propUser.hitokoto = {
    value: true,
    func: function (value) {
        ec.properties.hitokoto.value = value;
    }
};
propUser.bingwallpaper = {
    value: true,
    func: function (value) {
        ec.properties.bingwallpaper.value = value;
        if (ec.online) {
            if (ec.properties.bingwallpaper.value)
                ec.background.ec.plugin.bingWallpaper.fetch();

            else
                ec.background.set(ec.properties.background.value);
        }
    }
};
propUser.extraexams = {
    value: 'https://ec.nyase.ru/extraexams.json',
    func: function (value) {
        ec.properties.extraexams.value = value;
        if (ec.online)
            ec.exam.extra.fetch(ec.properties.extraexams.value);

        else
            ec.exam.extra.url = ec.properties.extraexams.value;
    }
};

export function applyUserProperties(properties) {
  const ec = globalThis.ec;
  if (properties.background) {
    ec.properties.background.func(`file:///${properties.background.value}`);
  }
  if (properties.breakon) {
    ec.properties.breakon.func(properties.breakon.value);
  }
  if (properties.finalonly) {
    ec.properties.finalonly.func(properties.finalonly.value);
  }
  if (properties.hitokoto) {
    ec.properties.hitokoto.func(properties.hitokoto.value);
  }
  if (properties.bingwallpaper) {
    ec.properties.bingwallpaper.func(properties.bingwallpaper.value);
  }
  if (properties.extraexams) {
    ec.properties.extraexams.func(properties.extraexams.value);
  }
}

