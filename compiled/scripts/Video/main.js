import * as Router from '../Router/main.js';
import { Render } from '../Render/main.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { easyFileType } from '../File/main.js';
import('./cut/API.js');
import('./mute/API.js');
import('./change_speed/API.js');
import('./reverse/API.js');
import('./change_volume/API.js');
const __dirname = dirname(fileURLToPath(import.meta.url));
const __maindir = dirname(fileURLToPath(import.meta.url)).split('\\').slice(0, -2).join('\\');
const __uploaderdir = __maindir + '\\scripts\\Uploader\\page\\';
const validActions = [
    'cut', 'mute', 'change_speed', 'reverse', "change_volume"
];
async function videoPage(req, res) {
    const file = req.query.file;
    const url = req.url.split('/').filter((a) => a.length > 0);
    url[url.length - 1] = url[url.length - 1].split('?')[0];
    let type;
    try {
        type = await easyFileType(__maindir + `\\public\\temp\\${file}`);
    }
    catch {
        let page = await Render('page', __uploaderdir, {}, false);
        res.send(page);
        return;
    }
    if (type != 'Video') {
        res.redirect('/video');
        return;
    }
    if (!url[1] || !validActions.includes(url[1])) {
        let page = await Render('player', __dirname, {
            file: `../public/temp/${file}`,
            fileName: file
        }, false);
        res.send(page);
    }
    else {
        let page = await Render(`${url[1]}\\page`, __dirname, {
            file: `../public/temp/${file}`,
            fileName: file
        }, false);
        res.send(page);
    }
}
Router.get('/video', videoPage);
Router.get('/video/*', videoPage);
