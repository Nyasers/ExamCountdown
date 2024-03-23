import $ from 'jquery';

export default {
    extable: {
        hitokoto: true,
    },
    origin: location.protocol == 'file:' ? 'https://ec.nyaser.top' : location.origin,
    cooldown: 1e4,
    retry: 6,
    fetch: async function (retry = ec.extension.retry, url = ec.extension.origin + '/ej') {
        ec.extension.retry = retry;
        $.getScript(url)
            .fail(function () {
                console.warn(`Retry: ${!!ec.extension.retry} (${ec.extension.retry})`);
                if (ec.extension.retry > 0) {
                    setTimeout(ec.extension.fetch, ec.extension.cooldown);
                    ec.extension.retry--;
                }
            });
    },
};