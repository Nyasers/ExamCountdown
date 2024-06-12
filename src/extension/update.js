import version from './version.js';

const module = {
  version: version
}

function getVersionString(date) {
  try { return date.toJSON().split(':00.')[0] } catch { return null }
}

export default {
  msg: (function () {
    const projectRoot = location.protocol == 'file:' ? decodeURI(location.href.split('file:///')[1].split('index.html')[0]).replaceAll('/', '\\') : undefined;
    return projectRoot
      ? `1.运行 ${projectRoot + 'update.cmd'}<br>`
      + `2.用浏览器打开 https://ec.nyase.ru/zip 下载压缩包，解压到${projectRoot}<br>`
      : '才不需要更新呢，哼！<br>';
  }).bind()(),
  check: (function () {
    if (typeof ec.version == "undefined") return Infinity;
    else if (typeof ec.update.version == "undefined") return false;
    else if (ec.version.getTime() == ec.update.version.getTime()) return false;
    else return (Time().getTime() - ec.update.version.getTime()) / 8.64e7;
  }).bind(),
  notice: (function () {
    let content = `Nyaser: 发现新版本！ (${getVersionString(ec.version)} -> ${getVersionString(ec.update.version)})<br>`;
    content += `--更新方法--<br>${ec.update.msg}`;
    if (version.length > 0) {
      content += "--更新日志--<br>";
      version.forEach(v => {
        if (new Date(v.date) - ec.version) {
          content += `${getVersionString(v.date)}: ${v.msg}<br>`;
        }
      });
    }
    $("body").append(`<center style="color:var(--fontColor)"><big>${content}</big></center>`);
  }).bind(module),
};