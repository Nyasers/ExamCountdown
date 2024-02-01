import $ from 'jquery';
import main from './main.js';
import extension from './extension.js';
import '../../cache/index.css';

globalThis.$ = $;
globalThis.ec = {};

main();

ec.extension = extension;
ec.version = new Date(VERSION);

setTimeout(() => ec.extension.fetch(6));
