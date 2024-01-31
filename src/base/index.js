import $ from 'jquery';
import main from './main.js';
import extension from './extension.js';
import '../../cache/index.css';

window.$ = $;
window.ec = {};

main();

ec.extension = extension;
ec.extension.fetch(6);

ec.version = new Date(VERSION);