import * as Router from '../Router/main.js';

import * as path from 'path';
import { fileURLToPath } from 'url';

var __dirname: any = path.dirname(fileURLToPath(import.meta.url)).split('\\').slice(0, -2).join('\\');

function sendFile(req: any, res: any) {
    res.sendFile(__dirname + '/' + req.url);
}

Router.get('/public/*', sendFile);

export default null;