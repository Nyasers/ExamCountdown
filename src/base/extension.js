import { $ } from 'jquery';

export default {
    fetch: async function (url = ec.origin + '/ej') {
        $.getScript(url)
    },
};