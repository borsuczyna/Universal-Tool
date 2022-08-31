const express = require('express');
app = express.Router();

async function videoPage(req, res) {
    const file = req.query.file;
    const type = fileType(file);
    var page = null;
    const url = req.url.split('/');
    url[url.length-1] = url[url.length-1].split('?')[0];

    let uploaderDir = __dirname.replaceAll('\\', '/').split('/').slice(0, -1).join('/') + '/Uploader/';

    if(type == 'Not exist') {
        page = await Render('page', uploaderDir);
    } else if(type != 'Video') {
        res.redirect(`/video/${url[2]}`);
        return;
    } else {
        if(!url[2] || url[2] == '') {
            page = await Render('video', __dirname, {
                file: `../public/temp/${file}`,
                fileName: file
            });
        } else {
            let actions = ['cut'];
            if(!actions.includes(url[2])) {
                res.redirect(`/video/${url[2]}`);
                return;
            }

            page = await Render(url[2] + '/page', __dirname, {
                file: `../public/temp/${file}`,
                fileName: file
            });
        }
    }

    // console.log(page);
    
    res.send(page);
}

app.get('/video', videoPage);
app.get('/video/*', videoPage);

module.exports = app;