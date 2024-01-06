import JSZip from "jszip";
import { fetchGroup } from './concat.mjs';
import { minifyJS, minifyCSS, minifyJSON } from './minify.mjs';

async function minifyCode(code, type) {
    switch (type) {
        case 'js':
            code = await minifyJS(code);
            break;
        case 'css':
            code = await minifyCSS(code);
            break;
        case 'json':
            code = await minifyJSON(code);
            break;
        default:
            console.warn('cannot minify \'' + type + '\' files');
            break;
    }
    return code;
}

async function fetchFile(file) {
    var args = file.split('.');
    var name, type, minify, content;
    if (args.length == 2) {
        name = args[0];
        type = args[1];
        minify = false;
    } else if (args.length == 3 && args[1] == 'min') {
        name = args[0];
        type = args[2];
        minify = true;
    } else {
        throw 'not found';
    }
    if (['js', 'css', 'json', 'cmd'].includes(type)) {
        content = await fetchGroup(name + type);
        if (minify) content = await minifyCode(content, type);
    } else if (type == 'html') {
        if (name == 'index') {
            content = await fetchHTML(0);
        } else if (['ext', 'extension'].includes(name)) {
            content = await fetchHTML(1);
        } else {
            throw 'not found';
        }
    } else {
        throw 'not found';
    }
    return content;
}

async function fetchHTML(code) {
    if (code == 0) {
        return `<!DOCTYPE html><html><ec><style>${await fetchFile('base.min.css')}</style><script>${await fetchFile('base.min.js')}</script></ec></html>`;
    } else if (code == 1) {
        return `<extension><ec><style>${await fetchFile('extension.min.css')}</style><script>${await fetchFile('extension.min.js')}</script></ec></extension>`;
    } else {
        throw 'not found';
    }
}

async function fetchProject() {
    var files = {
        html: await fetchHTML(0),
        json: await fetchFile('project.min.json'),
        cmd: await fetchFile('update.cmd'),
    }, result;
    try {
        var zip = new JSZip();
        zip.folder(`Wallpaper/projects/defaultprojects/ExamCountdown`)
            .file("index.html", files.html)
            .file("project.json", files.json)
            .file("update.cmd", files.cmd);
        result = await zip.generateAsync({
            type: "nodebuffer",
            compression: "deflate",
            compressionOptions: { level: 9 },
        });
        console.log(((result.length / (files.cmd.length + files.json.length + files.html.length)) * 100).toFixed(2) + "%zip",);
    } catch (error) {
        result = null;
        console.error(error);
    }
    return result;
}

/**
 * src
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function src(req, res) {
    var file = req.params.file;
    console.log(file);
    try {
        res.status(200);
        if (file == 'zip') {
            res.type('application/zip');
            var time = new Date().toJSON();
            res.setHeader("Content-Disposition", `filename=ExamCountdown_${time.slice(0, time.indexOf("T"))}.zip`);
            res.write(await fetchProject());
        } else {
            res.type('text/plain');
            res.write(await fetchFile(file));
        }
    } catch (ex) {
        res.writeHead(404);
        console.error(ex);
    } finally {
        res.end();
    }
};