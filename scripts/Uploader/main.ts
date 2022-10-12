import * as fs from 'fs';
import * as Router from '../Router/main.js';
import { generateToken, Token } from '../Queue/main.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { removeTempFile } from '../Public/main.js';

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const __maindir: string = __dirname.replaceAll('\\', '/').split('/').slice(0, -2).join('\\');

Router.post('/upload', (req: any, res: any) => {
    if(!req.files || !req.files.file) return;

    let file: any = req.files.file;
    let size: number = req.files.file.size;
    if(size > 5000 * 1024 * 1024) {
        res.status(406).json({
            message: 'Too big file'
        });
        return;
    }

    let token: Token = generateToken();
    let format: string = file.name.split('.').pop();
    let error: any = fs.writeFileSync(__maindir + `\\public\\temp\\${token}.${format}`, file.data);
    
    if(error) {
        res.status(406).json({
            message: 'File upload error'
        });
        return;
    };

    res.status(200).json({
        token: token,
        file: `${token}.${format}`
    });

    setTimeout(removeTempFile, 5 * 60 * 1000, __maindir + `\\public\\temp\\${token}.${format}`);
});