import * as Router from '../Router/main.js';
import * as fs from 'fs';
import config from '../../config.json' assert {type: 'json'};
import { outputLog } from '../Log/main.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

var __dirname: any = dirname(fileURLToPath(import.meta.url)).split('\\').slice(0, -2).join('\\');

function sendFile(req: any, res: any) {
    res.sendFile(__dirname + '/' + req.url);
}

export function removeTempFile(file_path: string){
    fs.unlink(file_path, (err) => {
        if(err) {
            console.error(err);
            return;
        };

        outputLog(`Removed ${file_path} after 5 minutes`);
    });
};

export function clearTempDirectory() {
    const files: string[] = fs.readdirSync(`${__dirname}\\public\\temp`);
    
    for(let file of files) {
        const error: any = fs.unlinkSync(`${__dirname}\\public\\temp\\${file}`);
        
        outputLog(`Removed undeleted temp file ${file}`);
    }
}

// UNCOMMENT LATER
// clearTempDirectory();

Router.get('/public/*', sendFile);