import express from 'express';
import compression from "compression";
import { src } from './src/index.mjs';
const app = express();

app.use(compression());
app.use('/src/:file', src);

app.listen(process.env.PORT || '3000');
