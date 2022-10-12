import * as Router from '../../Router/main.js';
import { Process } from '../../Process/main.js';
import { createQueueItem, generateToken, Token } from '../../Queue/main.js';

Router.post('/api/change_speed', (req: any, res: any) => {
    // if(!canDoApiRequest(req)) {
    //     res.status(404).json({
    //         message: 'Too many requests'
    //     })
    // }

    let file: string = req.body.file?.replaceAll('\\', '/').split('/').pop();
    let speed: number = req.body.speed;

    if(!file || typeof file !=  'string') {
        return res.status(400).send(`Invalid request body`);
    }

    if(speed < 0.01 || speed > 300) {
        return res.status(406).send('Invalid video speed');
    }

    let token: string = createQueueItem({
        action: 'video / change_speed',
        next: 'video',
    });

    res.status(200).json({
        token: token
    });

    let outFile: Token = generateToken();
    let process = new Process('change_speed', token, ['public\\temp', file, outFile + '.mp4', speed.toString()]);
});