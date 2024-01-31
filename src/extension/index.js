import exams from "./exams.js";
import hitokoto from "./hitokoto.js";
import update from './update.js'
import '../../cache/extension.css';

const { $, ec } = window;

if (ec.extension) delete ec.extension;

ec.exams.json.push(exams);
ec.exams.build();

$("ul#main").append($('<li class="hitokoto"></li>'));
ec.hitokoto = hitokoto;

ec.update = update;
let version = new Date(VERSION);
if (typeof ec.update == "undefined") ec.version = version;
else ec.update.version = version;

setTimeout(() => {
  if (ec.update && ec.update.check()) ec.update.notice();
}, 1e3);