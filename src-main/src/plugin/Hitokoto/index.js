import '../../../cache/hitokoto.css';
import { $ } from 'jquery';

const hitokoto = {
    api: {
        url: "https://v1.hitokoto.cn/",
        args: "max_length=256",
    },
    expiration: 0,
    qps: 1,
    lastquery: 0,
    timeout: {
        retry: 60000,
        request: 30000,
        refresh: 180000,
    },
    types: {
        a: "动画",
        b: "漫画",
        c: "游戏",
        d: "文学",
        e: "原创",
        f: "网络",
        g: "其他",
        h: "影视",
        i: "诗词",
        j: "网易云",
        k: "哲学",
        l: '抖机灵',
        x: "提示",
    },
};

hitokoto.set = (function (data = {}) {
    if (data.type != 'x') console.log(data);
    let type = this.types[data.type];
    if ('undefined' == typeof type) {
        setTimeout(() => this.set({
            type: "x",
            from: "Nyaser",
            hitokoto: "加载失败，稍后重试。",
            ttl: this.timeout.retry,
        }));
        return;
    }
    let from = data.from;
    let from_who = data.from_who;
    let author = '';
    if (from || from_who) {
        author = " -> ";
        if (from_who) {
            author += from_who;
            if (from) author += " -> ";
        }
        author += from ?? "";
    }
    if (data.type === "e")
        author += ` => [UID${data.creator_uid}] ${data.creator}`;
    let ttl = data.ttl ?? this.timeout.refresh;
    this.expiration = Time().getTime() + ttl;
    $("li.hitokoto").html(
        `[一言·<type class='hitokoto'>${type}</type>·<ttl class='hitokoto'></ttl>] <sentence class='hitokoto'>${data.hitokoto}</sentence><author class='hitokoto'>${author}</author>`
    );
    $("ttl.hitokoto").html(
        `<a class='hitokoto' href='javascript:void(0);' onClick='ec.plugin.hitokoto.change();'>${(
            (this.expiration - Time().getTime()) / 1000
        ).toFixed(0)}</a>`
    );
}).bind(hitokoto);

hitokoto.get = (function () {
    this.set({
        type: "x",
        from: "Nyaser",
        hitokoto: "加载中，请稍候。",
        ttl: this.timeout.request,
    });
    var request;
    if (request != null) request.abort();
    let url = this.api.url + "?" + this.api.args;
    ec.properties.user.hitokoto_types.value.forEach(key => url += `&c=${key}`);
    let queryTime = Time().getTime();
    url += `&_=${queryTime}`;
    let duration = queryTime - this.lastquery;
    if (duration > 1000 / this.qps) {
        this.lastquery = queryTime;
        request = $.getJSON(url)
            .then((d) => this.set(d))
            .fail(this.set);
    } else {
        this.set({
            type: "x",
            from: "Nyaser",
            hitokoto: "请求过快，稍后再试。",
            ttl: this.timeout.retry,
        });
    }
}).bind(hitokoto);

hitokoto.change = (function () {
    let timeout = this.expiration - Time().getTime();
    this.expiration = Time().getTime()
        + (timeout > 3000 ? timeout == Infinity ? this.timeout.refresh : 3000 : Infinity);
}).bind(hitokoto);

hitokoto.heartbeat = (function () {
    let hitokoto_ttl = (this.expiration - Time().getTime()) / 1000;
    if (hitokoto_ttl < 0) this.get();
    hitokoto_ttl = hitokoto_ttl.toFixed(0);
    if ($("ttl.hitokoto").text() != `${hitokoto_ttl}`)
        if ($("ttl.hitokoto a").html())
            $("ttl.hitokoto a").text(`${hitokoto_ttl}`);
        else $("ttl.hitokoto").text(`${hitokoto_ttl}`);
}).bind(hitokoto);

export const init = (function (ec) {
    $("ul#main").append($('<li class="hitokoto"></li>'));
    ec.plugin.hitokoto = this;
}).bind(hitokoto);

export const heartbeat = (function (ec) {
    if (ec.properties.user.hitokoto.value == true) {
        if ($("li.hitokoto").html() == '') {
            this.get();
        } else {
            this.heartbeat(ec);
        }
    } else if ($("li.hitokoto").html() != '') {
        $("li.hitokoto").html('');
    }
}).bind(hitokoto);
