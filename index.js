import express from 'express';
import compression from "compression";
import { src, fetchHTML } from './src/index.mjs';
const app = express();

app.use(compression());
app.use('/', async (req, res) => {
    res.charset = 'utf-8';
    res.status(200);
    res.type('text/html');
    res.end(await fetchHTML(0));
});
app.use('/src/:file', src);

app.listen(process.env.PORT || '3000');
