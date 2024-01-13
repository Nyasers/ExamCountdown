import { fetchFile } from './src/index.mjs';
import fs from 'fs';

if (fs.existsSync('./dist')) fs.rmdirSync('./dist', { recursive: true, force: true });
fs.mkdirSync('./dist');

fs.writeFileSync('./dist/index.html', await fetchFile('index.html'));