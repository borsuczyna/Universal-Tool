import * as fs from 'fs';
import * as Router from '../../Router/main.js';
import { createQueueItem, generateToken, Token } from '../../Queue/main.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { removeTempFile } from '../../Public/main.js';
import { easyFileType, FileType } from '../../File/main.js';
import { Render } from '../../Render/main.js';
import { Process } from '../../Process/main.js';

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const __maindir: string = dirname(fileURLToPath(import.meta.url)).split('\\').slice(0, -3).join('\\');
const __uploaderdir: string = __maindir + '\\scripts\\Uploader\\page\\';

Router.post('/api/merge', async (req: any, res: any) => {
    if(!req.files || !req.files.file) return;

    let file: any = req.files.file;
    let originalFile: string = req.body.originalFile?.replaceAll('\\', '/').split('/').pop();
    let size: number = req.files.file.size;
    if(size > 500 * 1024 * 1024) {
        res.status(406).json({
            message: 'Too big file'
        });
        return;
    }

    let token: Token = generateToken();
    let format: string = file.name.split('.').pop();
    let error: any = fs.writeFileSync(__maindir + `\\public\\temp\\${token}.${format}`, file.data);
    
    if(error || !originalFile || typeof originalFile != 'string') {
        res.status(406).json({
            message: 'File upload error'
        });
        return;
    };

    let type: FileType | boolean;

    try {
        type = await easyFileType(__maindir + `\\public\\temp\\${token}.${format}`);
    } catch {
        res.status(406).json({
            message: 'File upload error'
        });
        return;
    }

    let newToken: string = createQueueItem({
        action: 'video / rotate',
        next: 'video',
    });

    res.status(200).json({
        token: newToken
    });
    
    let outFile: Token = generateToken();
    let process: Process = new Process('merge', newToken, ['public\\temp', originalFile, `${token}.${format}`, outFile + '.mp4']);
});