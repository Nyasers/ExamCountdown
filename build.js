import fs from 'fs';
import { minify, minify_sync } from 'terser';
import webpack from 'webpack';
import { config1, config2, config3 } from './webpack.config.cjs';

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
    webpack(config1, ()=>
    webpack(config2, ()=> {
    //{ from: './src/cmd/' },
    //{ from: './src/pages/' },
    //{ from: './src/jpg/default.jpg' }
    if (fs.existsSync('./dist')) fs.rmSync('./dist', { recursive: true });
    fs.mkdirSync('./dist');
    ['base', 'extension'].forEach(
        async (name) =>
            fs.writeFileSync(
                `./dist/${name}.html`,
                await packHTML(`./cache/${name}.js`)
            )
    );}));
})()