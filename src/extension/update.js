// const ec = window.ec ?? globalThis.ec ?? null;

export default {
  cmd: decodeURI(location.href.split('file:///')[1].split('index.html')[0] + 'update.cmd'),
  href: "https://ec.nyaser.tk/zip",
  msg: (function () {
    return location.protocol == 'file:'
      ? `请运行 ${this.cmd} 进行更新，<br>或用浏览器打开 ${this.href} 下载压缩包手动更新。`
      : 'Update is unavailable online.'
  })(),
  check: function () {
    if (typeof ec.version == "undefined") return Infinity;
    else if (typeof this.version == "undefined") return false;
    else if (ec.version.getTime() == this.version.getTime()) return false;
    else return (new Date().getTime() - this.version.getTime()) / 8.64e7;
  },
  notice: function () {
    let content = `Nyaser: 更新可用 (${ec.version ? ec.version.toLocaleString('zh-cn') : undefined
      } -> ${this.version ? this.version.toLocaleString('zh-cn') : undefined
      })<br>${this.msg}`;
    $("body").append(`<center><big><big>${content}</big></big></center>`);
  },
};