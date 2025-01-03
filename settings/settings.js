import Store from 'electron-store'

export const config = {
    name: 'Settings',
    fileExtension: null,
    clearInvalidConfig: true,
    encryptionKey: 'ExamCountdown',
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
        text: {
            type: 'object',
            default: {
                start: '距离 {0} <strong>仅剩</strong>',
                ending: '距离 {0} 结束还有',
                time: '{0} ~ {1} 天 ~ {2} 小时 ~ {3} 秒',
            },
            properties: {
                start: {
                    type: 'string',
                },
                ending: {
                    type: 'string',
                },
                time: {
                    type: 'string',
                },
            },
            required: ['start', 'ending', 'time'],
        },
    }
}

export const settings = new Store(config)
