import version from './version.js';

function getVersionString(date) {
  return date?.toJSON()?.split(':00.')[0] ?? undefined;
}

export default {
  msg: (function () {
    const projectRoot = location.protocol == 'file:' ? decodeURI(location.href.split('file:///')[1].split('index.html')[0]).replaceAll('/', '\\') : undefined;
    return projectRoot
      ? `1.运行 ${projectRoot + 'update.cmd'}<br>`
      + `2.用浏览器打开 https://ec.nyase.ru/zip 下载压缩包，解压到${projectRoot}<br>`
      : '才不需要更新呢，哼！<br>';
  }).bind(globalThis)(),
  check: (function () {
    if (typeof ec.version == "undefined") return Infinity;
    else if (typeof ec.update.version == "undefined") return false;
    else if (ec.version.getTime() == ec.update.version.getTime()) return false;
    else return (Time().getTime() - ec.update.version.getTime()) / 8.64e7;
  }).bind(globalThis),
  notice: (function () {
    let content = `Nyaser: 更新可用 (${getVersionString(ec.version)} -> ${getVersionString(ec.update.version)})`;
    content += `<br>--更新方法--<br>${ec.update.msg}`;
    version.forEach(v => {
      if (ec.version.getTime() < new Date(v.date).getTime()) {
        content += `<br>${v.date}: ${v.msg} `;
      }
    });
    $("body").append(`<center style="color:var(--fontColor)"><big><big>${content}</big></big></center>`);
  }).bind(globalThis),
};