import fs from 'fs';
import path from 'path';
import { minify } from 'terser';
import archiver from 'archiver';
import webpack from 'webpack';
import webpackConfig from './webpack.config.cjs';
import terserConfig from './terser.config.js';
import exams from './src/extension/exams.js';

function MinifyJSON(code) {
    return JSON.stringify(JSON.parse(code));
}

async function packHTML(jsfile, ...workers) {
    var output = "<!doctype html><noscript><strong>We're sorry but ExamCountdown doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript>";
    output += "<ec>";
    workers.forEach(worker => {
        output += `<script id="${worker.id}" type="app/worker">`;
        output += fs.readFileSync(worker.js, 'utf-8'); fs.rmSync(worker.js);
        output += "</script>";
    });
    output += "<script>";
    var js = fs.readFileSync(jsfile, 'utf-8');
    var result = await minify(js, terserConfig);
    output += result.code;
    fs.writeFileSync(jsfile, result.code)
    output += "</script>";
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
    const zip = [
        { filename: 'index.html', data: { name: 'index.html' } },
        { filename: 'project.json', data: { name: 'project.json' } },
        { filename: 'update.cmd', data: { name: 'update.cmd' } },
    ];
    fs.readFile(json, 'utf-8', (err, data) => {
        if (err) throw err;
        const minified = MinifyJSON(data);
        fs.writeFileSync(json, minified, 'utf-8');
        packZip(zip, 'ExamCountdown.zip');
    });
}

async function postBuild() {
    // Merge license
    var license = '';
    fs.readdirSync(path.resolve('dist')).filter(n => n.endsWith('.LICENSE.txt'))
        .forEach(n => {
            if (license != '') license += '\r\n';
            license += fs.readFileSync(path.resolve('dist', n), 'utf-8');
            fs.rmSync(path.resolve('dist', n));
        });
    if (license != '') fs.writeFileSync(path.resolve('dist', 'license.txt'), license, 'utf-8');

    // Move css files
    fs.readdirSync(path.resolve('cache')).filter(n => n.endsWith('.css'))
        .forEach(n =>
            fs.cpSync(path.resolve('cache', n), path.resolve('dist', n))
        );
    fs.rmSync(path.resolve('cache'), { recursive: true });

    // Index
    fs.writeFile(
        path.resolve('dist/index.html'),
        await packHTML(path.resolve('dist/index.js')),
        'utf-8',
        postMake
    );

    // Extra Exams
    fs.writeFileSync(
        path.resolve('dist/extraexams.json'),
        JSON.stringify(exams),
        'utf-8'
    );
}

webpack(webpackConfig, postBuild);
