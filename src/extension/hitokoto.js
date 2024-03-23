const { $ } = globalec.hitokoto;

export default {
  api: {
    url: "https://v1.hitokoto.cn/",
    args: "max_length=256",
  },
  expiration: 0,
  qps: 1,
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
  set: function (data = false) {
    if (data && 'undefined' != typeof data.type) {
      if (data.type != 'x') console.log(data);
      let type = ec.hitokoto.type[data.type];
      if('undefined' == typeof type) {
        ec.hitokoto.set({
          type: "x",
          from: "Nyaser",
          hitokoto: "加载失败，稍后重试。",
          ttl: ec.hitokoto.timeout.retry,
        });
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
      let ttl = data.ttl ?? ec.hitokoto.timeout.refresh;
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
    let url = ec.hitokoto.api.url + "?" + ec.hitokoto.api.args;
    let types = ec.hitokoto.type; delete types.x;
    for (let key of Object.keys(types)) url += `&c=${key}`;
    let queryTime = Time().getTime();
    url += `&_=${queryTime}`;
    let duration = queryTime - ec.hitokoto.lastquery;
    if (duration > 1000 / ec.hitokoto.qps) {
      ec.hitokoto.lastquery = queryTime;
      request = $.getJSON(url)
        .then((d) => ec.hitokoto.set(d))
        .fail(ec.hitokoto.set);
    } else {
      // throw new Error(`Hitokoto: QPS Limitation! (${duration})`);
      ec.hitokoto.set({
        type: "x",
        from: "Nyaser",
        hitokoto: "请求过快，稍后再试。",
        ttl: ec.hitokoto.timeout.retry,
      });
    }
  },
  change: function () {
    let timeout = ec.hitokoto.expiration - Time().getTime();
    ec.hitokoto.expiration = Time().getTime()
      + (timeout > 3000 ? timeout == Infinity ? ec.hitokoto.timeout.refresh : 3000 : Infinity);
  },
  heartbeat: function () {
    let hitokoto_ttl = (ec.hitokoto.expiration - Time().getTime()) / 1e3;
    if (hitokoto_ttl < 0) ec.hitokoto.get();
    hitokoto_ttl = hitokoto_ttl.toFixed(0);
    if ($("ttl.hitokoto").text() != `${hitokoto_ttl}`)
      if ($("ttl.hitokoto a").html())
        $("ttl.hitokoto a").text(`${hitokoto_ttl}`);
      else $("ttl.hitokoto").text(`${hitokoto_ttl}`);
  },
};
