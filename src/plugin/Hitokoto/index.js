import '../../../cache/hitokoto.css';
const { $ } = globalThis;

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
    type: {
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
        // l: '抖机灵',
        x: "提示",
    },
    set: function (data = {}) {
        if (data.type != 'x') console.log(data);
        let type = ec.plugin.hitokoto.type[data.type];
        if ('undefined' == typeof type) {
            setTimeout(() => ec.plugin.hitokoto.set({
                type: "x",
                from: "Nyaser",
                hitokoto: "加载失败，稍后重试。",
                ttl: ec.plugin.hitokoto.timeout.retry,
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
        let ttl = data.ttl ?? ec.plugin.hitokoto.timeout.refresh;
        ec.plugin.hitokoto.expiration = Time().getTime() + ttl;
        $("li.hitokoto").html(
            `[一言·<type class='hitokoto'>${type}</type>·<ttl class='hitokoto'></ttl>] <sentence class='hitokoto'>${data.hitokoto}</sentence><author class='hitokoto'>${author}</author>`
        );
        $("ttl.hitokoto").html(
            `<a class='hitokoto' href='javascript:void(0);' onClick='ec.plugin.hitokoto.change();'>${(
                (ec.plugin.hitokoto.expiration - Time().getTime()) / 1000
            ).toFixed(0)}</a>`
        );
    },
    get: function () {
        ec.plugin.hitokoto.set({
            type: "x",
            from: "Nyaser",
            hitokoto: "加载中，请稍候。",
            ttl: ec.plugin.hitokoto.timeout.request,
        });
        var request;
        if (request != null) request.abort();
        let url = ec.plugin.hitokoto.api.url + "?" + ec.plugin.hitokoto.api.args;
        let types = Object.assign({}, ec.plugin.hitokoto.type); delete types.x;
        for (let key of Object.keys(types)) url += `&c=${key}`;
        let queryTime = Time().getTime();
        url += `&_=${queryTime}`;
        let duration = queryTime - ec.plugin.hitokoto.lastquery;
        if (duration > 1000 / ec.plugin.hitokoto.qps) {
            ec.plugin.hitokoto.lastquery = queryTime;
            request = $.getJSON(url)
                .then((d) => ec.plugin.hitokoto.set(d))
                .fail(ec.plugin.hitokoto.set);
        } else {
            ec.plugin.hitokoto.set({
                type: "x",
                from: "Nyaser",
                hitokoto: "请求过快，稍后再试。",
                ttl: ec.plugin.hitokoto.timeout.retry,
            });
        }
    },
    change: function () {
        let timeout = ec.plugin.hitokoto.expiration - Time().getTime();
        ec.plugin.hitokoto.expiration = Time().getTime()
            + (timeout > 3000 ? timeout == Infinity ? ec.plugin.hitokoto.timeout.refresh : 3000 : Infinity);
    },
    heartbeat: function () {
        let hitokoto_ttl = (ec.plugin.hitokoto.expiration - Time().getTime()) / 1000;
        if (hitokoto_ttl < 0) ec.plugin.hitokoto.get();
        hitokoto_ttl = hitokoto_ttl.toFixed(0);
        if ($("ttl.hitokoto").text() != `${hitokoto_ttl}`)
            if ($("ttl.hitokoto a").html())
                $("ttl.hitokoto a").text(`${hitokoto_ttl}`);
            else $("ttl.hitokoto").text(`${hitokoto_ttl}`);
    },
};

// Init hitokoto
export function init(ec) {
    $("ul#main").append($('<li class="hitokoto"></li>'));
    ec.plugin.concat(hitokoto);
}

export function heartbeat(ec) {
    if (ec.properties.user.hitokoto.value == true) {
        if ($("li.hitokoto").html() == '') {
            hitokoto.get();
        } else {
            hitokoto.heartbeat(ec);
        }
    } else if ($("li.hitokoto").html() != '') {
        $("li.hitokoto").html('');
    }
}