// const { $, ec } = window;

export default {
  href: "https://ec.nyaser.tk/zip",
  msg: `请运行 ${decodeURI(location.href.split('file:///')[1].split('index.html')[0] + 'update.cmd')} 进行更新，<br>或用浏览器打开 ${ec.update.href} 下载压缩包手动更新。`,
  check: () => {
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
}
