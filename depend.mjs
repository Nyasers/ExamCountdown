import fs from 'fs'
import child_process from 'child_process';
import { buffer } from 'stream/consumers';

const args = process.argv.slice(2)

fs.readFile('package.json', 'utf-8', (err, data) => {
    if (err) throw err
    const pkg = JSON.parse(data), spawn_args = []
    spawn_args.push('install')
    args.forEach(e => spawn_args.push(e))
    Object.keys(pkg.dependencies ?? []).forEach(e => {
        spawn_args.push(e)
    })
    Object.keys(pkg.devDependencies ?? []).forEach(e => {
        spawn_args.push(e)
    })
    const cp = child_process.spawn('npm', spawn_args)
    cp.stdout.on('data', buffer => console.log(buffer.toString()))
    cp.stderr.on('data', buffer => console.error(buffer.toString()))
});