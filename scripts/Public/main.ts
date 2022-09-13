import * as Router from '../Router/main.js';
import * as fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

var __dirname: any = dirname(fileURLToPath(import.meta.url)).split('\\').slice(0, -2).join('\\');

function sendFile(req: any, res: any) {
    res.sendFile(__dirname + '/' + req.url);
}

export function removeTempFile(file_path: string){
    fs.unlink(file_path, (err) => {
        if(err){
            console.error(err);
            return;
        };

        console.log(`${file_path} REMOVED AFTER 5 MINUTES`);
    });
};


Router.get('/public/*', sendFile);

export default null;
