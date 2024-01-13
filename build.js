import { fetchFile, fetchProject } from './src/index.mjs';
import fs from 'fs';

if (fs.existsSync('./dist')) fs.rmdirSync('./dist', { recursive: true, force: true });
fs.mkdirSync('./dist');

var files = ['index.html', 'extension.html'];

files.forEach(async (fileName) => fs.writeFileSync('./dist/' + fileName, await fetchFile(fileName)));
fs.writeFileSync('./dist/dist.zip', await fetchProject(0));
console.log('Done');
