import { fetchFile } from './src/index.mjs';
import fs from 'fs';

if (fs.existsSync('./dist')) fs.rmSync('./dist', { recursive: true, force: true });
fs.mkdirSync('./dist');

fs.copyFileSync('./_redirects', './dist/_redirects');
fs.copyFileSync('./_headers', './dist/_headers');

var files = ['project.json', 'update.cmd', 'base.html', 'index.html', 'extension.html', 'default.jpg', 'ExamCountdown.zip', 'update.zip', 'update.ps1', 'update.cmd'];
files.forEach(async (fileName) => fs.writeFileSync('./dist/' + fileName, await fetchFile(fileName)));
