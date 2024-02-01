const { $, ec } = window;

export default {
  cmd: decodeURI(location.href.split('file:///')[1].split('index.html')[0] + 'update.cmd');
  href: "https://ec.nyaser.tk/zip",
  msg: (function () {
    return location.protocol == 'file:'
      ? `请运行 ${this.cmd} 进行更新，<br>或用浏览器打开 ${this.href} 下载压缩包手动更新。`
      : 'Update is unavailable online.'
  })(),
  check: function () {
    if (typeof ec.version == "undefined") return Infinity;
    else if (typeof ec.update.version == "undefined") return false;
    else if (ec.version.getTime() == ec.update.version.getTime()) return false;
    else return (new Date().getTime() - ec.update.version.getTime()) / 8.64e7;
  },
  notice: () => {
    let content = `Nyaser: 更新可用 (${ec.version ? ec.version.toLocaleString('zh-cn') : undefined
      } -> ${ec.update.version ? ec.update.version.toLocaleString('zh-cn') : undefined
      })<br>${ec.update.msg}`;
    $("body").append(`<center><big><big>${content}</big></big></center>`);
  },
};