import fs from 'fs'

const args = process.argv.slice(2)

fs.readFile('package.json', 'utf-8', (err, data) => {
    if (err) throw err
    const pkg = JSON.parse(data), pkgs = []
    Object.keys(pkg.dependencies ?? []).forEach(e => {
        pkgs.push(e)
    })
    Object.keys(pkg.devDependencies ?? []).forEach(e => {
        pkgs.push(e)
    })
    console.info(`npm install ${pkgs.join(' ')} ${args.join(' ')}`)
});