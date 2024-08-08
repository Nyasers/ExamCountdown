import fs from 'fs';
import { spawn } from 'child_process';

fs.readFile('package.json', 'utf-8', (err, data) => {
    if (err) throw err;
    const pkg = JSON.parse(data);
    var args = ['i'];
    Object.keys(pkg.dependencies).forEach(e => {
        args.push(e)
    });
    shell("npm", args);
});

function shell(cmd, args) {
    const ls = spawn(cmd, args);

    ls.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.error(`${data}`);
    });
}