import $ from 'jquery';

export default {
    url: 'https://ec.nyaser.tk/e',
    fetch: async function (retry) {
        if (retry) this.retry = retry;
        try {
            await fetch(this.url)
                .then((response) => {
                    response.text()
                        .then((text) => {
                            var extension = $($(text)[0]).children('extension'); console.log($($(text)[0]));
                            $('ec').append(extension.children('style'), $(`<script>${extension.children('script')[0].innerHTML}</script>`));
                        })
                        .catch((error) => {
                            throw error;
                        });
                })
                .catch((error) => {
                    throw error;
                });
        } catch (error) {
            console.error({ error, retry: this.retry });
            if (this.retry > 0) {
                setTimeout(() => ec.extension.fetch(), 5e3);
                this.retry--;
            }
        }
    },
    retry: 0,
};