import hitokoto from "./hitokoto.js";
import '../../cache/extension.css';

function init(ec) {
    // Init hitokoto
    $("ul#main").append($('<li class="hitokoto"></li>'));
    ec.plugin.hitokoto = hitokoto;
}

export default init.bind();