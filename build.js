import fs from 'fs';
import path from 'path';
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { minify } from 'terser';
import archiver from 'archiver';
import webpack from 'webpack';
import config from './webpack.config.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function MinifyJSON(code) {
    return JSON.stringify(JSON.parse(code));
}

async function packHTML(jsfile, tag = null) {
    var output = "<!doctype html>";
    output += "<ec>";
    if (tag !== null) output += `<${tag}>`;
    output += "<script>";
    var opitions = {
        format: {
            ecma: 2016,
            comments: false,
        },
        mangle: {
            reserved: ['$', "ec"],
        },
        module: true,
        toplevel: true,
    };
    var js = fs.readFileSync(jsfile, 'utf-8');
    output += (await minify(js, opitions)).code;
    output += "</script>";
    if (tag !== null) output += `</${tag}>`;
    output += "</ec>";
    return output;
}

async function packZip(files, destination) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const filename = path.resolve(__dirname, 'dist', destination);
    const output = fs.createWriteStream(filename);
    archive.pipe(output);

    files.forEach((file) => {
        const filename1 = path.resolve(__dirname, 'dist', file.filename);
        archive.file(filename1, file.data);
    })

    await archive.finalize();
}

async function createPackages() {
    const pathto = '/Wallpaper/projects/defaultprojects/ExamCountdown';
    const install = [
        { filename: 'base.html', data: { name: path.resolve(pathto, 'index.html') } },
        { filename: 'project.json', data: { name: path.resolve(pathto, 'project.json') } },
        { filename: 'update.cmd', data: { name: path.resolve(pathto, 'update.cmd') } },
    ];
    const update = [
        { filename: 'base.html', data: { name: 'index.html' } },
        { filename: 'project.json', data: { name: 'project.json' } },
        { filename: 'update.cmd', data: { name: 'update.cmd' } },
    ];
    packZip(install, 'ExamCountdown.zip');
    packZip(update, 'update.zip');
}

webpack(config, async () => {
    fs.rmSync(__dirname + '/cache', { recursive: true });
    ['base', 'index', 'extension'].forEach(
        async (name) => {
            fs.writeFileSync(
                `${__dirname}/dist/${name}.html`,
                await packHTML(`${__dirname}/dist/${name}.js`, name)
            );
            if (name == 'base') createPackages();
        }
    );
});
