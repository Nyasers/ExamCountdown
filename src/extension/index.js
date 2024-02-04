import exams from "./exams.js";
import hitokoto from "./hitokoto.js";
import update from './update.js'
import '../../cache/extension.css';

// For old versions
if ('undefined' == typeof globalThis.$) globalThis.$ = $;
if ('undefined' == typeof globalThis.ec) globalThis.ec = ec;

if ('undefined' != typeof ec.extension) delete ec.extension;
else throw new Error('Duplicate Runs Not Allowed.');

exams.forEach((exam) => ec.exam.json.push(exam));
ec.exam.build();

$("ul#main").append($('<li class="hitokoto"></li>'));
ec.hitokoto = hitokoto;

ec.update = update;
ec.update.version = new Date(VERSION);

setTimeout(() => {
  if (ec.update && ec.update.check()) ec.update.notice();
}, 1e3);