import $ from 'jquery';

export default {
    url: (location.protocol == 'file:' ? 'https://ec.nyaser.top' : location.origin) + '/ej',
    fetch: async function (retry) {
        if (retry) ec.extension.retry = retry;
        $.getScript(ec.extension.url)
            .fail(function (msg) {
                console.warn(`Retry: ${!!ec.extension.retry} (${ec.extension.retry})`);
                if (ec.extension.retry > 0) {
                    setTimeout(() => ec.extension.fetch(), 5e3);
                    ec.extension.retry--;
                }
                throw msg;
            });
    },
    retry: 0,
};