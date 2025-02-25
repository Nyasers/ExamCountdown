import fs from 'fs'
import path from 'path'
import { minify } from 'terser'
import rspack from '@rspack/core'
import rspackConfig from './rspack.config.js'
import terserConfig from './terser.config.js'

/**
 * packHTML
 * @param {string} jsfile 
 * @param  {...{id: string, js: string}} workers 
 * @returns {Promise<string>} HTML
 */
async function packHTML(jsfile, ...workers) {
    var output = `<!DOCTYPE html><meta charset="utf-8"><noscript><strong>We're sorry but ExamCountdown doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript>`
    output += "<ec>"
    workers.forEach(async worker => {
        var js = fs.readFileSync(worker.js, 'utf-8'); fs.rmSync(worker.js)
        var result = await minify(js, terserConfig)
        output += `<script id="${worker.id}" type="app/worker">${result.code}</script>`
    })
    var js = fs.readFileSync(jsfile, 'utf-8'); fs.rmSync(jsfile)
    var result = await minify(js, terserConfig)
    output += `<script>${result.code}</script>`
    output += "</ec>"
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

    // Move css files
    if (rspackConfig[0].mode == 'development') {
        fs.readdirSync(path.resolve('cache')).filter(n => n.endsWith('.css'))
            .forEach(n =>
                fs.cpSync(path.resolve('cache', n), path.resolve('dist', n))
        )
    }
    fs.rmSync(path.resolve('cache'), { recursive: true })

    // Index
    fs.writeFileSync(
        path.resolve('dist/index.html'),
        await packHTML(path.resolve('dist/index.js')),
        'utf-8'
    )

    // _redirects
    fs.readFile(path.resolve('../package.json'), 'utf-8', (_err, data) => {
        const version = JSON.parse(data).version
        fs.readFile(path.resolve('dist/_redirects'), 'utf-8', (_err, data) => {
            const redirects = data.replaceAll('${VERSION}', version)
            fs.writeFileSync(path.resolve('dist/_redirects'), redirects, 'utf-8')
        })
    })
}

const args = process.argv.slice(2)

rspackConfig[2].plugins[0]._args[0]["TAURI"] = args[0] != 'deploy'

rspack(rspackConfig, postBuild)
