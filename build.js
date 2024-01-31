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

async function packZip(files) {
    const archive = archiver('zip',{zlib:{level:9}});
}

(async function () {
    webpack(config, async () => {
        fs.rmSync(__dirname + '/cache', { recursive: true });
        ['base', 'extension'].forEach(
            async (name) => {
                fs.writeFileSync(
                    `${__dirname}/dist/${name}.html`,
                    await packHTML(`${__dirname}/dist/${name}.js`, name)
                );
            }
        );
    });
})()