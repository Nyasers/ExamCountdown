import $ from 'jquery';
import main from './main.js';
import '../../cache/index.css';
import { networkWaiter } from './network-waiter.js';
import { ec } from './ec.js';

// Expose $ and ec
globalThis.$ = $;
globalThis.ec = ec

// Init
main();

// wait for online
networkWaiter();