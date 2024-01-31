import fs, { truncate } from 'fs';
import { minify, minify_sync } from 'terser';
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

(async function () {
    webpack(config, async () => {
        fs.rmSync('./cache', { recursive: true });
        ['base', 'extension'].forEach(
            async (name) => {
                fs.writeFileSync(
                    `./dist/${name}.html`,
                    await packHTML(`./dist/${name}.js`, name)
                );
            }
        );
    });
})()