import fs from 'fs';
import path from 'path';
import { minify } from 'terser';
import archiver from 'archiver';
import webpack from 'webpack';
import config from './webpack.config.cjs';

function MinifyJSON(code) {
    return JSON.stringify(JSON.parse(code));
}

async function packHTML(jsfile, tag = null) {
    var output = "<!doctype html>";
    output += "<ec>";
    if (tag !== null) output += `<${tag}>`;
    output += "<script>";
    var js = fs.readFileSync(jsfile, 'utf-8');
    var result = await minify(js, config.terserOptions);
    output += result.code;
    output += "</script>";
    if (tag !== null) output += `</${tag}>`;
    output += "</ec>";
    return output;
}

async function packZip(files, destination) {
    const archive = archiver('zip', { zlib: { level: 9, memLevel: 9 } });
    const filename = path.resolve('dist', destination);
    const output = fs.createWriteStream(filename);
    archive.pipe(output);

    files.forEach((file) => {
        const filename1 = path.resolve('dist', file.filename);
        archive.file(filename1, file.data);
    })

    await archive.finalize();
}

async function postMake() {
    const json = path.resolve('dist/project.json');
    fs.readFile(json, 'utf-8', (err, data) => {
        if (err) throw err;
        const minified = MinifyJSON(data);
        fs.writeFileSync(json, minified, 'utf-8');
    });
    const pathto = '/Wallpaper/projects/defaultprojects/ExamCountdown';
    const install = [
        { filename: 'index.html', data: { name: path.resolve(pathto, 'index.html') } },
        { filename: 'project.json', data: { name: path.resolve(pathto, 'project.json') } },
        { filename: 'update.cmd', data: { name: path.resolve(pathto, 'update.cmd') } },
    ];
    const update = [
        { filename: 'index.html', data: { name: 'index.html' } },
        { filename: 'project.json', data: { name: 'project.json' } },
        { filename: 'update.cmd', data: { name: 'update.cmd' } },
    ];
    packZip(install, 'ExamCountdown.zip');
    packZip(update, 'update.zip');
}

webpack(config, async () => {
    fs.rmSync(path.resolve('cache'), { recursive: true });
    fs.writeFile(
        path.resolve('dist/index.html'),
        await packHTML(path.resolve('dist/index.js')),
        postMake
    );
    fs.writeFileSync(
        path.resolve('dist/extension.html'),
        await packHTML(path.resolve('dist/extension.js'), 'extension')
    );
});
