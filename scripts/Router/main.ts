import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { outputLog } from '../Log/main.js';

var app: any = null;

export async function init(port: number = 3000) {
    app = express();

    app.use(fileUpload({
        limits: {
            fileSize: 5000 * 1024 * 1024
        }
    }));

    app.use(bodyParser.json());

    await new Promise((resolve: CallableFunction) => {
        app.listen(port, () => {
            outputLog(`Listening on port ${port}...`);
            resolve();
        });
    });
}

export function get(path: string, callback: (req: any, res: any) => void) {
    if(app == null) throw new Error('Attempt to add routing without initializing it, use Router.init();');

    app.get(path, callback);
}

export function post(path: string, callback: (req: any, res: any) => void) {
    if(app == null) throw new Error('Attempt to add routing without initializing it, use Router.init();');

    app.post(path, callback);
}