import { $ } from 'jquery';

export function sortExamArray(array) {
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

export function buildExam(json) {
    if (typeof json.time.start === typeof undefined) return null;
    if (typeof json.time.end === typeof undefined) json.time.end = json.time.start;
    let exam = {
        title: json.title,
        time: json.time.autoyear ? autoYear(json.time) : { start: new Date(json.time.start), end: new Date(json.time.end) },
        top: !!json.top,
    };
    exam.title = exam.title.replace("YYYY", exam.time.start.getFullYear());
    if (exam.time.start.getTime()) return new Exam(exam);
    else return null;
}

function autoYear(time) {
    let start = new Date(time.start), end = new Date(time.end);
    while (Time() > end) {
        start.setFullYear(start.getFullYear() + 1);
        end.setFullYear(end.getFullYear() + 1)
    }
    return { start, end };
}

// https://www.cnblogs.com/soymilk2019/p/15388984.html
if (!String.prototype.format) {
    String.prototype.format = function () {
        const args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
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
            const precision = ec.properties.precision.value;
            var t = this.getTime(),
                text = $(`<p>${this.title}</p>`).text();
            if (t >= 0) {
                text += "倒计时";
            } else {
                t = -t;
                text += "结束倒计时";
            }
            return `${text} ${(t / 8.64e7).toFixed(precision.day)} 天`;
        };
        this.getText = function () {
            const { start, ending, time } = ec.properties.text.value;
            const { day, hour, second } = ec.properties.precision.value;
            var t = this.getTime(),
                text;
            if (t >= 0) {
                text = start.format(this.title);
            } else {
                t = -t;
                text = ending.format(this.title);
            }
            return time.format(text, (t / 8.64e7).toFixed(day), (t / 3.6e6).toFixed(hour), (t / 1e3).toFixed(second));
        };
    }
}

export const exam = {
    json: [],
    array: [],
    default: null,
    breakon: '',
    build: null,
};

exam.default = (function () {
    let time = new Date;
    time.setFullYear(time.getFullYear() + 1);
    return {
        title: "<strong>所有考试均已结束，请打开设置配置新项目！</strong><p hidden>",
        time: {
            start: time.toISOString(),
            end: time.toISOString(),
        },
        top: true,
    }
})();

exam.build = (function (breakon = null) {
    this.json = Array.from(ec.properties.exams.value);
    if (this.json.length == 0)
        this.json = this.default;

    this.array = buildExamArray(this.json);

    if (breakon != null)
        this.breakon = breakon;
    if (this.breakon == '')
        this.breakon = null;
    if (this.breakon != null) {
        var endex = this.array.findLastIndex((exam) => exam.title.includes(this.breakon));
        if (endex != -1) {
            this.array[endex].top = true;
            this.array.splice(endex + 1);
        }
    }

    if (true === ec.properties.finalonly.value)
        this.array.splice(0, this.array.length - 1);
    return this.array;
}).bind(exam);
