import Store from 'electron-store'

export const schema = {
    background: {
        type: 'string',
        default: 'file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg',
    },
    breakon: {
        type: 'string',
        default: '高考',
    },
    finalonly: {
        type: 'boolean',
        default: false,
    },
    hitokoto: {
        type: 'boolean',
        default: true,
    },
    bingwallpaper: {
        type: 'boolean',
        default: true,
    },
    exams: {
        type: 'array',
        default: [{
            title: "福建高考",
            time: {
                start: "$YYYY/06/07 09:00",
                end: "$YYYY/06/09 18:15",
            },
            top: false,
        }],
    },
}

export const settings = new Store({ name: 'Settings', schema })
