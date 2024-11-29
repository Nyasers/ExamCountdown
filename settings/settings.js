import Store from 'electron-store'

export const config = {
    name: 'Settings',
    encryptionKey: 'ExamCountdown',
    clearInvalidConfig: true,
    fileExtension: null,
    schema: {
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
            items: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string',
                    },
                    time: {
                        type: 'object',
                        properties: {
                            start: {
                                type: 'string',
                            },
                            end: {
                                type: 'string',
                            },
                        },
                        required: ['start', 'end'],
                    },
                    top: {
                        type: 'boolean',
                        default: false,
                    }
                },
                required: ['title', 'time'],
            },
            minItems: 1,
        },
    }
}

export const settings = new Store(config)
