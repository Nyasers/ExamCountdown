import express from "express";

const app = express();
app.use(express.static('dist'));

app.get('/ej', function(req, res) {
    res.redirect('/extension.js');
});

app.listen(3000);