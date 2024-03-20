const { $, ec } = globalThis;

export default {
  api: {
    url: "https://v1.hitokoto.cn/",
    args: "max_length=256",
  },
  expiration: 0,
  qps: 2,
  lastquery: 0,
  timeout: {
    retry: 6e4,
    request: 3e4,
    refresh: 1.8e5,
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
  set: function (data) {
    if (data.type != 'x') console.log(data);
    if (data) {
      if (!(type = ec.hitokoto.type[data.type])) {
        ec.hitokoto.set({
          type: "x",
          from: "Nyaser",
          hitokoto: "加载失败，稍后重试。",
          ttl: ec.hitokoto.timeout.retry,
        });
        return;
      }
      from = data.from;
      from_who = data.from_who;
      if (from || from_who) {
        author = " -> ";
        if (from_who) {
          author += from_who;
          if (from) author += " -> ";
        }
        author += from ?? "";
      } else author = null;
      if (data.type === "e")
        author += ` => [UID${data.creator_uid}] ${data.creator}`;
      var ttl = data.ttl ?? ec.hitokoto.timeout.refresh;
      ec.hitokoto.expiration = Time().getTime() + ttl;
      $("li.hitokoto").html(
        `[一言·<type class='hitokoto'>${type}</type>·<ttl class='hitokoto'></ttl>] <sentence class='hitokoto'>${data.hitokoto}</sentence><author class='hitokoto'>${author}</author>`
      );
      $("ttl.hitokoto").html(
        `<a class='hitokoto' href='javascript:void(0);' onClick='ec.hitokoto.change();'>${(
          (ec.hitokoto.expiration - Time().getTime()) / 1e3
        ).toFixed(0)}</a>`
      );
    } else ec.hitokoto.get();
  },
  get: function () {
    ec.hitokoto.set({
      type: "x",
      from: "Nyaser",
      hitokoto: "加载中，请稍候。",
      ttl: ec.hitokoto.timeout.request,
    });
    var request;
    if (request != null) request.abort();
    var url = ec.hitokoto.api.url + "?" + ec.hitokoto.api.args;
    for (let key of Object.keys(ec.hitokoto.type)) url += `&c=${key}`;
    var queryTime = Time().getTime();;
    url += `&_=${queryTime}`;
    var duration = queryTime - ec.hitokoto.lastquery;
    if (duration > 1000 / ec.hitokoto.qps) {
      ec.hitokoto.lastquery = queryTime;
      request = $.getJSON(url)
        .then((d) => ec.hitokoto.set(d))
        .fail((e) => ec.hitokoto.set(e));
    } else {
      throw new Error(`Hitokoto: QPS Limitation! (${duration})`);
    }
  },
  change: function () {
    var timeout = ec.hitokoto.expiration - Time().getTime();
    ec.hitokoto.expiration = Time().getTime()
      + (timeout > 3000 ? timeout == Infinity ? ec.hitokoto.timeout.refresh : 3000 : Infinity);
  },
  heartbeat: function () {
    var hitokoto_ttl = (ec.hitokoto.expiration - Time().getTime()) / 1e3;
    if (hitokoto_ttl < 0) ec.hitokoto.get();
    hitokoto_ttl = hitokoto_ttl.toFixed(0);
    if ($("ttl.hitokoto").text() != `${hitokoto_ttl}`)
      if ($("ttl.hitokoto a").html())
        $("ttl.hitokoto a").text(`${hitokoto_ttl}`);
      else $("ttl.hitokoto").text(`${hitokoto_ttl}`);
  },
};
