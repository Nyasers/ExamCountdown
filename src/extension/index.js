import exams from "./exams.js";
import hitokoto from "./hitokoto.js";
import update from './update.js'
import '../../cache/extension.css';

// For old versions
if ('undefined' == typeof globalThis.$) globalThis.$ = $;
if ('undefined' == typeof globalThis.ec) globalThis.ec = ec;
if ('undefined' == typeof globalThis.Time) globalThis.Time = () => new Date;

// Avoid duplicate runs
if ('undefined' != typeof ec.extension) delete ec.extension;
else throw new Error('Duplicate Runs Not Allowed.');

// Import extended countdowns
exams.forEach((exam) => ec.exam.json.push(exam));
ec.exam.build();

// Init hitokoto
$("ul#main").append($('<li class="hitokoto"></li>'));
ec.hitokoto = hitokoto;

// Init update
ec.update = update;
ec.update.version = new Date(VERSION);

// check update
setTimeout(() => {
  if (ec.update && ec.update.check()) ec.update.notice();
}, 1e3);