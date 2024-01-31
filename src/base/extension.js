const { $, ec } = window;

export default {
    url: 'https://ec.nyaser.tk/j',
    fetch: async function (retry) {
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