import * as Router from '../../Router/main.js';
import { Render } from '../../Render/main.js';
import { Process } from '../../Process/main.js';
import { createQueueItem, generateToken, Token } from '../../Queue/main.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname: string = dirname(fileURLToPath(import.meta.url));

const validQualities = [
    '480p', '720p', '1080p'
]

export async function handleRequest(req: any, res: any) {
    let page: string = await Render('page', __dirname, {}, false);
    res.send(page);
}

declare global {
    interface String {
        matchAt(expression: RegExp, index: number | null): string | boolean;
    }
}

String.prototype.matchAt = function(this: string, expression: RegExp, index: number | null): string | boolean {
    let match: RegExpExecArray | null = expression.exec(this);

    return match ? match[(index || 0) + 1] : false;
}

Router.post('/api/youtube-downloader', (req: any, res: any) => {
    // if(!canDoApiRequest(req)) {
    //     res.status(404).json({
    //         message: 'Too many requests'
    //     })
    // }

    let url: string | boolean = req.body.url.matchAt(/watch\?v=([^&]*)/);
    let quality: string = req.body.quality;

    if(!url || typeof url != 'string' || url?.length < 4 || !validQualities?.includes(quality)) {
        return res.status(400).send(`Invalid request body`);
    }

    let token: string = createQueueItem({
        action: 'youtube download',
        next: 'video',
    });

    res.status(200).json({
        token: token
    });

    let outFile: Token = generateToken();

    let process = new Process('ytmp4', token, ['public\\temp', url, quality, outFile + '.mp4']);
});