import { Render } from '../Render/main.js';
import * as Router from '../Router/main.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const chars = 'qwertyuiopasdsfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXXCCVBNBM1234567890';
;
;
const queue = {};
export function generateToken(length = 24) {
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.random() * chars.length);
    }
    return token;
}
;
export function outputConsole(token, type, message) {
    if (!queue[token])
        return;
    queue[token].console.push([type, message]);
}
;
export function createQueueItem(data) {
    let token = generateToken();
    queue[token] = {
        action: data.action || '-',
        next: data.next || '',
        start: new Date(),
        progress: 0,
        finished: false,
        token: token,
        lastUpdated: new Date(),
        console: []
    };
    return token;
}
;
export function setProgress(token, progress) {
    if (!queue[token])
        return;
    queue[token].progress = progress;
}
;
export function setFinish(token, file) {
    if (!queue[token])
        return;
    queue[token].finished = file;
}
;
export function getQueueItem(token) {
    return queue[token];
}
;
export function removeQueueItem(token) {
    delete queue[token];
}
;
Router.get('/queue', async (req, res) => {
    let item = getQueueItem(req.query.token);
    if (!req.query.token || !item) {
        res.redirect('/');
        return;
    }
    let page = await Render('page', __dirname, item, false);
    res.send(page);
});
Router.get('/api/queue', async (req, res) => {
    let item = getQueueItem(req.query.token);
    if (!req.query.token || !item) {
        res.status(404).json({
            message: 'invalid token'
        });
        return;
    }
    res.status(200).json(item);
    if (item.finished) {
        removeQueueItem(req.query.token);
    }
});
