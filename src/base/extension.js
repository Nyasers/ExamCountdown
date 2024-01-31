import $ from 'jquery';
//const { $, ec } = window;

export default {
    url: location.protocol=='file:' ? 'https://ec.nyaser.tk/ej' : location.origin+'/ej',
    fetch: async function (retry) {
        alert(this.url);
        if (retry) this.retry = retry;
        $.getScript(this.url)
            .fail(function (msg) {
                console.warn(`Retry: ${!!this.retry} (${this.retry})`);
                if (this.retry > 0) {
                    setTimeout(() => ec.extension.fetch(), 5e3);
                    this.retry--;
                }
                throw msg;
            });
    },
    retry: 0,
};