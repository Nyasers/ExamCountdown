import fs from 'fs';
// import { spawn } from 'child_process';

fs.readFile('package.json', 'utf-8', (err, data) => {
    if (err) throw err;
    const pkg = JSON.parse(data);
    var args = ['install'];
    Object.keys(pkg.dependencies).forEach(e => {
        args.push(e)
    });
    Object.keys(pkg.devDependencies).forEach(e => {
        args.push(e)
    });
    console.info(`npm ${args.join(' ')}`);
    // shell("npm", args);
});

// function shell(cmd, args) {
//     const ls = spawn(cmd, args);

//     ls.stdout.on('data', (data) => {
//         console.log(`${data}`);
//     });

//     ls.stderr.on('data', (data) => {
//         console.error(`${data}`);
//     });
// }