const express = require('express');
const app = express.Router();

app.get('/', async (req, res) => {
    let page = await Render('page', __dirname);
    res.send(page);
});

console.log('siema');

module.exports = app;