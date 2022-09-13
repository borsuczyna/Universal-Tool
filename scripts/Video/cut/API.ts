import * as Router from '../../Router/main.js';
import { Process } from '../../Process/main.js';
import { createQueueItem, generateToken, Token } from '../../Queue/main.js';

Router.post('/api/cut', (req: any, res: any) => {
    // if(!canDoApiRequest(req)) {
    //     res.status(404).json({
    //         message: 'Too many requests'
    //     })
    // }

    let file: string = req.body.file?.replaceAll('\\', '/').split('/').pop();
    let start: string = req.body.start?.toString();
    let finish: string = req.body.finish?.toString();

    if(!file || !start || !finish || typeof file !=  'string' || typeof start !=  'string' || typeof finish !=  'string') {
        return res.status(400).send(`Invalid request body`);
    }

    let token: string = createQueueItem({
        action: 'video / cut',
        next: 'video',
    });

    res.status(200).json({
        token: token
    });

    let outFile: Token = generateToken();
    let process = new Process('cut', token, ['public\\temp', file, outFile + '.mp4', req.body.start.toString(), req.body.finish.toString()]);
});