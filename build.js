import { fetchFile, fetchProject } from './src/index.mjs';
import fs from 'fs';

if (fs.existsSync('./dist')) fs.rmdirSync('./dist', { recursive: true, force: true });
fs.mkdirSync('./dist');

var files = ['index.html', 'extension.html', 'default.jpg'];

files.forEach(async (fileName) => fs.writeFileSync('./dist/' + fileName, await fetchFile(fileName)));
fs.writeFileSync('./dist/ExamCountdown.zip', await fetchProject(0));
console.log('Done');
