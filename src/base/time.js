import $ from 'jquery';

const url = 'https://time.is/?c=d3Y-3m-3dXtH2i2s.MXfmtXc2Xo480Xz1Xa1Xb51ea29.4e4185.28571f.2d99db.80265.1bb85e.1c3b23Xw1Xv20240205Xh0Xi1XZ1XmXuXB0Xs0XT0&l=zh';
const iframe = $('<iframe>').attr('src', url);
$('body').append(iframe);

function Time(iframe) {
    var idocument = iframe[0].contentDocument;
    var timeStr = $(idocument).find('#dd').text() + 'T' + $(idocument).find('#clock').text();
    var time = new Date(timeStr);
    return time;
}

export default function () {
    var time = Time(iframe);
    // console.log(!!time.valueOf());
    return !!time.valueOf() ? time : Time();
}