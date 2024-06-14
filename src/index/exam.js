import { $ } from 'jquery';

function sortExamArray(array) {
    return array.sort((a, b) => {
        return a.time.start - b.time.start;
    })
}

function buildExamArray(json) {
    var array = [];
    for (i = 0; i < json.length; i++) {
        var exam = buildExam(json[i]);
        if (exam) array.push(exam);
    }
    return sortExamArray(array);
}

function buildExam(json) {
    if (typeof json.time.start === typeof undefined) return null;
    if (typeof json.time.end === typeof undefined)
        json.time.end = json.time.start;
    json.time = autoYear(json.time);
    let exam = {
        title: json.title,
        time: { start: new Date(json.time.start), end: new Date(json.time.end) },
        top: !!json.top,
    };
    exam.title = exam.title.replace("$YYYY", exam.time.start.getFullYear());
    if (exam.time.start.getTime()) return new Exam(exam);
    else return null;
}

function autoYear(time) {
    let year = Time().getFullYear();
    if (Time() > new Date(time.end.replace("$YYYY", year))) year++;
    time.start = time.start.replace("$YYYY", year);
    time.end = time.end.replace("$YYYY", year);
    return time;
}

export class Exam {
    constructor(json) {
        Object.assign(this, json);
        this.getTime = function () {
            var t = this.time.start - Time();
            if (t < 0) {
                t = 0;
                if (this.time.end.getTime()) {
                    t = Time() - this.time.end;
                    if (t > 0) t = 0;
                }
            }
            return t;
        };
        this.getTitle = function () {
            var t = this.getTime(),
                text = $(`<p>${this.title}</p>`).text();
            if (t >= 0) {
                text += "倒计时";
            } else {
                t = -t;
                text += "结束倒计时";
            }
            return `${text} ${(t / 8.64e7).toFixed(3)} 天`;
        };
        this.getText = function () {
            var t = this.getTime(),
                text;
            if (t >= 0) {
                text = `距离 ${this.title} <strong>仅剩</strong>`;
            } else {
                t = -t;
                text = `距离 ${this.title} 结束还有`;
            }
            return `${text} ~ ${(t / 8.64e7).toFixed(3)} 天 ~ ${(t / 3.6e6).toFixed(
                2
            )} 小时 ~ ${(t / 1e3).toFixed(1)} 秒`;
        };
    }
}

export default exam;

const exam = {
    json: [],
    array: [],
    default: [],
    extra: {},
    breakon: '',
    build,
};

exam.default = [{
    title: "福建高考",
    time: {
        start: "$YYYY/06/07 09:00",
        end: "$YYYY/06/09 18:15",
    }
},
{
    title: '福建中考',
    time: {
        start: '$YYYY/06/19 08:30',
        end: '$YYYY/06/21 11:55'
    }
},
{
    title: '福建会考',
    time: {
        start: '$YYYY/06/21 15:00',
        end: '$YYYY/06/21 17:45'
    }
}]

exam.build = function (breakon = null) {
    ec.exam.json = Array.from(ec.exam.default);
    if (ec.exam.extra.enabled)
        ec.exam.extra.json.forEach(exam => ec.exam.json.push(exam));
    ec.exam.array = buildExamArray(ec.exam.json);

    if (breakon != null)
        ec.exam.breakon = breakon;
    if (ec.exam.breakon == '')
        ec.exam.breakon = null;
    if (ec.exam.breakon != null) {
        var endex = ec.exam.array.findLastIndex((exam) => exam.title.includes(ec.exam.breakon));
        if (endex != -1) {
            ec.exam.array[endex].top = true;
            ec.exam.array.splice(endex + 1);
        }
    }

    if (ec.properties.user.finalonly.value)
        ec.exam.array.splice(0, ec.exam.array.length - 1);
    return ec.exam.array;
};

exam.extra = {
    enabled: true,
    retry: 6,
    url: 'extraexams.json',
    fetch: async function (url = ec.exam.extra.url) {
        $.getJSON(url)
            .done(function (data) {
                try {
                    ec.exam.extra.json = data;
                    ec.exam.build();
                } catch (e) {
                    console.error(e);
                }
            })
            .fail(function () {
                if (ec.exam.extra.retry-- >= 0) setTimeout(() => ec.exam.extra.fetch(url), 1e4), console.warn({ url, retry: ec.exam.extra.retry + 1 })
                else ec.exam.extra.retry = 6;
            });
    },
    json: []
};