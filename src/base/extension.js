import $ from 'jquery';

export default {
    extable: {
        hitokoto: true,
    },
    url: (location.protocol == 'file:' ? 'https://ec.nyaser.top' : location.origin) + '/ej',
    fetch: async function (retry) {
        if (retry) ec.extension.retry = retry;
        $.getScript(ec.extension.url)
            .fail(function () {
                console.warn(`Retry: ${!!ec.extension.retry} (${ec.extension.retry})`);
                if (ec.extension.retry > 0) {
                    setTimeout(() => ec.extension.fetch(), 5e3);
                    ec.extension.retry--;
                }
                return;
            });
    },
    retry: 0,
};