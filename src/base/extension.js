import { $ } from 'jquery';

export default {
    extable: {
        hitokoto: true,
    },
    fetch: async function (url = ec.origin + '/ej') {
        $.getScript(url)
    },
};