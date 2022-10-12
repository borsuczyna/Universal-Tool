import * as Router from '../Router/main.js';
import { Render } from '../Render/main.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { easyFileType, FileType } from '../File/main.js';

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const __maindir: string = dirname(fileURLToPath(import.meta.url)).split('\\').slice(0, -2).join('\\');
const __uploaderdir: string = __maindir + '\\scripts\\Uploader\\page\\';

async function imagePage(req: any, res: any) {
    const file: string = req.query.file;
    const url: string[] = req.url.split('/').filter((a: string) => a.length > 0);
    url[url.length-1] = url[url.length-1].split('?')[0];
    
    let type: FileType | boolean;

    try {
        type = await easyFileType(__maindir + `\\public\\temp\\${file}`);
    } catch {
        let page: string = await Render('home', __dirname, {}, false);
        res.send(page);
        return;
    }
    
    if(type != 'Image') {
        res.redirect('/image');
        return;
    }

    let page: string = await Render(`editor\\page`, __dirname, {
        file: `../public/temp/${file}`,
        fileName: file
    }, false);
    res.send(page);
}

async function editorPage(req: any, res: any) {
    const page: string = await Render('page', __dirname + '\\editor', {}, true);
    res.send(page);
}

Router.get('/image', imagePage);
Router.get('/editor', editorPage);