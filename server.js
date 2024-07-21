import express from "express";

const app = express();
app.use(express.static('dist'));

app.get('/uj', function(req, res) {
    res.redirect('/update.js');
});

app.listen(3000);