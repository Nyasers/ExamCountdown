import './define.js';
import main from './base/main.js';
import exams from './extension/exams.js';
import hitokoto from './extension/hitokoto.js';
import '../cache/base.css';
import '../cache/extension.css';

ec.exams.json.push(exams);
ec.exams.build();

main();
$("ul#main").append($('<li class="hitokoto"></li>'));
ec.hitokoto = hitokoto;