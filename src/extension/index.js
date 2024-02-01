import exams from "./exams.js";
import hitokoto from "./hitokoto.js";
import update from './update.js'
import '../../cache/extension.css';

if ('undefined' == typeof globalThis.ec) globalThis.ec = ec;

if (ec.extension) delete ec.extension;

exams.forEach((exam) => ec.exam.json.push(exam));
ec.exam.build();

$("ul#main").append($('<li class="hitokoto"></li>'));
ec.hitokoto = hitokoto;

ec.update = update;
ec.update.version = new Date(VERSION);

setTimeout(() => {
  if (ec.update && ec.update.check()) ec.update.notice();
}, 1e3);