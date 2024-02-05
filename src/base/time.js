import $ from 'jquery';

const url = 'https://time.is/?c=d3Y-3m-3dXtH2i2s.MXfmtXc2Xo480Xz1Xa1Xb51ea29.4e4185.28571f.2d99db.80265.1bb85e.1c3b23Xw1Xv20240205Xh0Xi1XZ1XmXuXB0Xs0XT0&l=zh';
const meta = $('<meta>').attr('name', 'referrer').attr('content', 'never');
const iframe = $('<iframe>').attr('src', url).attr('rel', 'noreferrer').attr('hidden', '');
$('head').append(meta);
$('body').append(iframe);

function getTime(iframe) {
    var time = new Date(undefined);
    try {
        var idocument = iframe[0].contentDocument;
        if (idocument == null) {
            globalThis.Time = () => new Date;
            throw new Error(`Blocked a frame with origin "${location.origin}" from accessing a cross-origin frame.`);
        }
        var timeStr = $('#dd', idocument).text() + 'T' + $('#clock', idocument).text();
        time = new Date(timeStr);
    } catch (e) { console.error(e) }
    return !!time.valueOf() ? time : new Date;
}

globalThis.Time = function () {
    return getTime(iframe);
}