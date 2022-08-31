const fileUpload = require('express-fileupload');
const fs = require('fs');
const express = require('express');

const app = express.Router()

app.use(fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 },
}));

app.post('/upload', async (req, res) => {
    if(!req.files || !req.files.file) return;

    let file = req.files.file;
    let size = req.files.file.size;
    if(size > 500 * 1024 * 1024) {
        res.status(406).json({
            message: 'Too big file'
        });
        return;
    }

    let token = generateToken();
    let format = file.name.split('.').pop();
    let mainPath = __dirname.replaceAll('\\', '/').split('/').slice(0, -2).join('/');
    let error = fs.writeFileSync(mainPath + `/public/temp/${token}.${format}`, file.data);
    
    if(error) {
        res.status(406).json({
            message: 'File upload error'
        });
        return;
    }

    res.status(200).json({
        token: token,
        file: `${token}.${format}`
    });
});

module.exports = app;