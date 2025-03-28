import fs from 'fs'
import path from 'path'
import { minify } from 'terser'
import terserConfig from './terser.config.js'

/**
 * packHTML
 * @param {string} jsfile 
 * @returns {Promise<string>} HTML
 */
async function packHTML(jsfile) {
    var output = `<!DOCTYPE html><meta charset="utf-8"><div id="app"></div>`
    var js = fs.readFileSync(jsfile, 'utf-8');
    var result = await minify(js, terserConfig)
    output += `<script type="module">${result.code}</script>`
    return output
}

async function postBuild() {
    // Merge license
    var license = ''
    fs.readdirSync(path.resolve('dist')).filter(n => n.endsWith('.LICENSE.txt'))
        .forEach(n => {
            if (license != '') license += '\r\n'
            license += fs.readFileSync(path.resolve('dist', n), 'utf-8')
            fs.rmSync(path.resolve('dist', n))
        })
    if (license != '') fs.writeFileSync(path.resolve('dist', 'license.txt'), license, 'utf-8')

    // Index
    fs.writeFileSync(
        path.resolve('dist/index.html'),
        await packHTML(path.resolve('dist/index.js')),
        'utf-8'
    )
}

postBuild()
