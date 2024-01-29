import exams from "./exams.js";
import hitokoto from "./hitokoto.js";
import update from './update.js'
import './css/index.css';

ec.exams.json.push(exams);
ec.exams.build();
$("ul#main").append($('<li class="hitokoto"></li>'));
ec.hitokoto = hitokoto;
ec.update = update;