import $ from 'jquery';

export default {
    extable: {
        hitokoto: true,
    },
    origin: location.protocol == 'file:' ? 'https://ec.nyaser.top' : location.origin,
    cooldown: 1e4,
    main: {
        retry: 6,
        fetch: async function (retry = ec.extension.main.retry, url = ec.extension.origin + '/ej') {
            ec.extension.main.retry = retry;
            $.getScript(url)
                .fail(function () {
                    console.warn(`Retry: ${!!ec.extension.main.retry} (${ec.extension.main.retry})`);
                    if (ec.extension.main.retry > 0) {
                        setTimeout(ec.extension.main.fetch, ec.extension.cooldown);
                        ec.extension.main.retry--;
                    }
                });
        },
    },
    exams: {
        retry: 6,
        fetch: async function (retry = ec.extension.exams.retry, url = ec.extension.origin + '/eej') {
            ec.extension.exams.retry = retry;
            $.getJSON(url)
                .done(function (data) {
                    try {
                        ec.exam.extension.json = JSON.parse(data);
                    } catch (e) {
                        console.error(e);
                    }
                })
                .fail(function () {
                    console.warn(`Retry: ${!!ec.extension.exams.retry} (${ec.extension.exams.retry})`);
                    if (ec.extension.exams.retry > 0) {
                        setTimeout(ec.extension.exams.fetch, ec.extension.cooldown);
                        ec.extension.exams.retry--;
                    }
                });
        },
    }
};