export default {
  msg: location.protocol == 'file:'
    ? `请运行 ${decodeURI(location.href.split('file:///')[1].split('index.html')[0] + 'update.cmd')
    } 进行更新，<br>或用浏览器打开 https://ec.nyaser.tk/zip 下载压缩包手动更新。`
    : undefined,
  check: function () {
    const ec = globalThis.ec;
    if (typeof ec.version == "undefined") return Infinity;
    else if (typeof ec.update.version == "undefined") return false;
    else if (ec.version.getTime() == ec.update.version.getTime()) return false;
    else return (Time().getTime() - ec.update.version.getTime()) / 8.64e7;
  },
  notice: function () {
    const ec = globalThis.ec;
    let content = `Nyaser: 更新可用 (${ec.version ? ec.version.toLocaleString('zh-cn') : undefined
      } -> ${ec.update.version ? ec.update.version.toLocaleString('zh-cn') : undefined
      })<br>${ec.update.msg}`;
    $("body").append(`<center><big><big>${content}</big></big></center>`);
  },
};