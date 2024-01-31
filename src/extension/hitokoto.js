//const { $ } = window;

export default {
  api: {
    url: "https://v1.hitokoto.cn/",
    args: "max_length=256",
  },
  expiration: 0,
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
    console.log(data);
    if (data) {
      if (!(type = this.type[data.type])) {
        this.set({
          type: "x",
          from: "Nyaser",
          hitokoto: "加载失败，稍后重试。",
          ttl: this.timeout.retry,
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
      var ttl = data.ttl ?? this.timeout.refresh;
      this.expiration = new Date().getTime() + ttl;
      $("li.hitokoto").html(
        `[一言·<type class='hitokoto'>${type}</type>·<ttl class='hitokoto'></ttl>] <sentence class='hitokoto'>${data.hitokoto}</sentence><author class='hitokoto'>${author}</author>`
      );
      $("ttl.hitokoto").html(
        `<a class='hitokoto' href='javascript:void(0);' onClick='ec.hitokoto.change();'>${(
          (this.expiration - new Date().getTime()) /
          1e3
        ).toFixed(0)}</a>`
      );
    } else this.get();
  },
  get: function () {
    this.set({
      type: "x",
      from: "Nyaser",
      hitokoto: "加载中，请稍候。",
      ttl: this.timeout.request,
    });
    var request;
    if (request != null) request.abort();
    var url = this.api.url + "?" + this.api.args;
    for (let key of Object.keys(this.type)) url += `&c=${key}`;
    request = $.getJSON(url)
      .then((d) => this.set(d))
      .fail((e, t) => this.set({ e: e, t: t }));
  },
  change: function () {
    console.log((timeout = this.expiration - new Date().getTime()));
    return (this.expiration =
      new Date().getTime() +
      (timeout > 3000
        ? timeout == Infinity
          ? this.timeout.refresh
          : 3000
        : Infinity));
  },
  heartbeat: function () {
    var hitokoto_ttl = (this.expiration - new Date().getTime()) / 1e3;
    if (hitokoto_ttl < 0) this.get();
    hitokoto_ttl = hitokoto_ttl.toFixed(0);
    if ($("ttl.hitokoto").text() != `${hitokoto_ttl}`)
      if ($("ttl.hitokoto a").html())
        $("ttl.hitokoto a").text(`${hitokoto_ttl}`);
      else $("ttl.hitokoto").text(`${hitokoto_ttl}`);
  },
};
