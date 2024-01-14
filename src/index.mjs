import JSZip from "jszip";
import fs from 'fs/promises';
import { fetchFile as concatFile, fetchGroup } from './concat.mjs';
import { minifyJS, minifyCSS, minifyJSON } from './minify.mjs';
import { truncate } from "fs";

export async function minifyCode(code, type) {
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

export async function fetchFile(file) {
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
    } else if (type == 'jpg' && name == 'default') {
        content = await fs.readFile('./src/jpg/default.jpg');
    } else if (type == 'zip') {
        switch (name) {
            case 'update':
                content = await fetchProject(false, true);
                break;
            case 'local':
                content = await fetchProject(true, false);
                break;
            default:
                content = await fetchProject(false, false);
                break;
        }
    } else {
        throw 'not found';
    }
    return content;
}

export async function fetchHTML(code) {
    if (code == 0) { // index
        return `<!DOCTYPE html><ec><style>${await fetchFile('base.min.css')}</style><script>${await fetchFile('base.min.js')}</script></ec>`;
    } else if (code == 1) { // extension
        return `<!DOCTYPE html><ec><extension><style>${await fetchFile('extension.min.css')}</style><script>${await fetchFile('extension.min.js')}</script></extension></ec>`;
    } else if (code == 2) { // local
        return `<!DOCTYPE html><ec><style>${await fetchFile('base.min.css')}${await fetchFile('extension.min.css')}</style><script>${await fetchFile('base.min.js')}${await fetchFile('extension.min.js')}</script></ec>`;
    } else {
        throw 'not found';
    }
}

export async function fetchProject(local = false, root = false) {
    var files = {
        html: local ? await fetchHTML(2) : await fetchHTML(0),
        json: await fetchFile('project.min.json'),
        cmd: await fetchFile('update.cmd'),
    }, result;
    try {
        var zip = new JSZip();
        var folder = zip.folder(`Wallpaper/projects/defaultprojects/ExamCountdown`)
            .file("index.html", files.html)
            .file("project.json", files.json)
            .file("update.cmd", files.cmd);
        result = await (root ? folder : zip).generateAsync({
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
        } else if (file == 'local_zip') {
            res.type('application/zip');
            var time = new Date().toJSON();
            res.setHeader("Content-Disposition", `filename=ExamCountdown_${time.slice(0, time.indexOf("T"))}.local.zip`);
            res.write(await fetchProject(true));
        } else if (file == 'default.jpg') {
            res.type('image/jpeg');
            res.write(await fs.readFile('./src/jpg/default.jpg'));
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