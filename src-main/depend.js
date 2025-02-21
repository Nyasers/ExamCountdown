import fs from 'fs'

fs.readFile('package.json', 'utf-8', (err, data) => {
    if (err) throw err
    const pkg = JSON.parse(data)
    var args = ['install']
    Object.keys(pkg.dependencies ?? []).forEach(e => {
        args.push(e)
    })
    Object.keys(pkg.devDependencies ?? []).forEach(e => {
        args.push(e)
    })
    console.info(`npm ${args.join(' ')}`)
});