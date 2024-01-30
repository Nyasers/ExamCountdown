import exams from "./exams.js";
import hitokoto from "./hitokoto.js";
import update from './update.js'
import '../../cache/extension.css';

if (ec.extension) delete ec.extension;
ec.exams.json.push(exams);
ec.exams.build();
$("ul#main").append($('<li class="hitokoto"></li>'));
ec.hitokoto = hitokoto;
ec.update = update;
if (location.origin == "file://") {
  setTimeout(() => {
    if (ec.update && ec.update.check()) ec.update.notice();
  }, 1e3);
}