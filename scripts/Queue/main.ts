import { Render } from '../Render/main.js';
import * as Router from '../Router/main.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const chars: string = 'qwertyuiopasdsfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXXCCVBNBM1234567890';

export type Token = string;

interface QueueItem {
    action: string;
    next: string;
    start: Date;
    progress: number;
    finished: boolean | string;
    token: Token;
    lastUpdated: Date;
    console: [type: string, message: string][];
};

interface QueueItemMin {
    action: string;
    next: string;
}

interface Queue {
    [key: Token]: QueueItem
};

const queue: Queue = {};

export function generateToken(length: number = 24): Token {
    let token: Token = '';

    for(let i: number = 0; i < length; i++) {
        token += chars.charAt(Math.random()*chars.length);
    }

    return token;
};

export function outputConsole(token: Token, type: string, message: string) {
    if(!queue[token]) return;

    queue[token].console.push([type, message]);
};

export function createQueueItem(data: QueueItemMin): Token {
    let token: Token = generateToken();
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
};

export function setProgress(token: Token, progress: number) {
    if(!queue[token]) return;
    
    queue[token].progress = progress;
};

export function setFinish(token: Token, file: string) {
    if(!queue[token]) return;

    queue[token].finished = file;
};

export function getQueueItem(token: Token) : QueueItem {
    return queue[token];
};

export function removeQueueItem(token: Token) {
    delete queue[token];
};

Router.get('/queue', async (req: any, res: any) => {
    let item: QueueItem = getQueueItem(req.query.token);
    if(!req.query.token || !item) {
        res.redirect('/');
        return;
    }

    let page: string = await Render('page', __dirname, item, false);
    res.send(page);
});

Router.get('/api/queue', async (req: any, res: any) => {
    let item: QueueItem = getQueueItem(req.query.token);
    if(!req.query.token || !item) {
        res.status(404).json({
            message: 'invalid token'
        });
        return;
    }

    res.status(200).json(item);

    if(item.finished) {
        removeQueueItem(req.query.token);
    }
});