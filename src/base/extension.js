import $ from 'jquery';

export default {
    extable: {
        hitokoto: true,
    },
    origin: location.protocol == 'file:' ? 'https://ec.nyaser.top' : location.origin,
    retry: {
        main: 6,
        exams: 6,
        cooldown: 1e4,
    },
    fetch: {
        main: async function (retry) {
            if (retry) ec.extension.retry.main = retry;
            $.getScript(ec.extension.origin + '/ej')
                .fail(function () {
                    console.warn(`Retry: ${!!ec.extension.retry.main} (${ec.extension.retry.main})`);
                    if (ec.extension.retry.main > 0) {
                        setTimeout(() => ec.extension.fetch(), ec.extension.retry.cooldown);
                        ec.extension.retry.main--;
                    }
                    return;
                });
        },
        exams: async function (retry) {
            if (retry) ec.extension.retry.exams = retry;
            $.getJSON(ec.extension.origin + '/eej')
                .done(function (data) {
                    try {
                        ec.exam.extension.json = JSON.parse(data);
                    } catch (e) {
                        console.error(e);
                    }
                })
                .fail(function () {
                    console.warn(`Retry: ${!!ec.extension.retry.exams} (${ec.extension.retry.exams})`);
                    if (ec.extension.retry.exams > 0) {
                        setTimeout(() => ec.extension.fetchExams(), ec.extension.retry.cooldown);
                        ec.extension.retry.exams--;
                    }
                    return;
                });
        },
    }
};