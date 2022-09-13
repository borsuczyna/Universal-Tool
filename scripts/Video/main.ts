import * as Router from '../Router/main.js';
import { Render } from '../Render/main.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { easyFileType, FileType } from '../File/main.js';

import('./cut/API.js');
import('./mute/API.js');
import('./change_speed/API.js');
import('./reverse/API.js');

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const __maindir: string = dirname(fileURLToPath(import.meta.url)).split('\\').slice(0, -2).join('\\');
const __uploaderdir: string = __maindir + '\\scripts\\Uploader\\page\\';

const validActions = [
    'cut', 'mute', 'change_speed', 'reverse'
]

async function videoPage(req: any, res: any) {
    const file: string = req.query.file;
    const url: string[] = req.url.split('/').filter((a: string) => a.length > 0);
    url[url.length-1] = url[url.length-1].split('?')[0];
    
    let type: FileType | boolean;

    try {
        type = await easyFileType(__maindir + `\\public\\temp\\${file}`);
    } catch {
        let page: string = await Render('page', __uploaderdir, {}, false);
        res.send(page);
        return;
    }
    
    if(type != 'Video') {
        res.redirect('/video');
        return;
    }

    if(!url[1] || !validActions.includes(url[1])) {
        let page: string = await Render('player', __dirname, {
            file: `../public/temp/${file}`,
            fileName: file
        }, false);
        res.send(page);
    } else {
        let page: string = await Render(`${url[1]}\\page`, __dirname, {
            file: `../public/temp/${file}`,
            fileName: file
        }, false);
        res.send(page);
    }
}

Router.get('/video', videoPage);
Router.get('/video/*', videoPage);