import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { outputLog } from '../Log/main.js';
var app = null;
export async function init(port = 3000) {
    app = express();
    app.use(fileUpload({
        limits: {
            fileSize: 50 * 1024 * 1024
        }
    }));
    app.use(bodyParser.json());
    await new Promise((resolve) => {
        app.listen(port, () => {
            outputLog(`Listening on port ${port}...`);
            resolve();
        });
    });
}
export function get(path, callback) {
    if (app == null)
        throw new Error('Attempt to add routing without initializing it, use Router.init();');
    app.get(path, callback);
}
export function post(path, callback) {
    if (app == null)
        throw new Error('Attempt to add routing without initializing it, use Router.init();');
    app.post(path, callback);
}
