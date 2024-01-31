import $ from 'jquery';
//const { $ } = window;

function buildExam(json) {
    if (typeof json.time.start === typeof undefined) return null;
    if (typeof json.time.end === typeof undefined)
        json.time.end = json.time.start;
    json.time = autoYear(json.time);
    let exam = {
        title: json.title,
        time: { start: new Date(json.time.start), end: new Date(json.time.end) },
        top: json.top,
    };
    exam.title = exam.title.replace("$YYYY", exam.time.start.getFullYear());
    if (exam.time.start.getTime()) return new Exam(exam);
    else return null;
}

function autoYear(time) {
    let year = new Date().getFullYear();
    if (new Date() > new Date(time.end.replace("$YYYY", year))) year++;
    time.start = time.start.replace("$YYYY", year);
    time.end = time.end.replace("$YYYY", year);
    return time;
}

export class Exam {
    constructor(json) {
        Object.assign(this, json);
        this.getTime = function () {
            var t = this.time.start - new Date();
            if (t < 0) {
                t = 0;
                if (this.time.end.getTime()) {
                    t = new Date() - this.time.end;
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

export default {
    json: [],
    array: [],
    breakon: null,
    sort: function () {
        this.array.sort((a, b) => {
            return a.time.start - b.time.start;
        });
    },
    build: function (breakon = null) {
        this.array = [];
        for (i = 0; i < this.json.length; i++) {
            var exam = buildExam(this.json[i]);
            if (exam) this.array.push(exam);
        }
        this.sort();
        if (breakon || (breakon = this.breakon)) {
            this.breakon = breakon;
            var endex = this.array.findLastIndex((exam) => exam.title.includes(breakon));
            if (endex) this.array.splice(endex + 1);
        } else this.breakon = null;
    },
};