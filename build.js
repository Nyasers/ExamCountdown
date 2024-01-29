import fs from 'fs';
import { minify } from 'terser';
import webpack from 'webpack';
import config from './webpack.config.cjs';

webpack(config,
    async (err, stats) => {
        process.stdout.write(stats.toString() + '\n');
        fs.writeFileSync('./dist/base.html', await fetchHTML(0));
    }
);

async function minifyJS(code) {
    var opitions = {
        format: {
            ecma: 2016,
            comments: false,
        },
        mangle: {
            reserved: ["ec"],
        },
        module: true,
        toplevel: true,
    };
    var result;
    try {
        result = (await minify(code, opitions)).code;
    } catch (error) {
        result = code;
        console.error(error);
    }
    return result;
}

function MinifyJSON(code) {
    return JSON.stringify(JSON.parse(code));
}

async function fetchHTML(code) {
    if (code == 0) { // index
        return `<!DOCTYPE html><ec><style>${fs.readFileSync('./dist/base.css', 'utf-8')}</style><script>${await minifyJS(fs.readFileSync('./dist/base.js', 'utf-8'))}</script></ec>`;
    } else if (code == 1) { // extension
        return `<!DOCTYPE html><ec><extension><style>${fs.readFileSync('./dist/extension.css', 'utf-8')}</style><script>${await minifyJS(fs.readFileSync('./dist/extension.js', 'utf-8'))}</script></extension></ec>`;
    } else if (code == 2) { // local
        return `<!DOCTYPE html><ec><style>${await fetchFile('base.min.css')}${await fetchFile('extension.min.css')}</style><script>${await fetchFile('local.min.js')}</script></ec>`;
    } else {
        throw 'not found';
    }
}