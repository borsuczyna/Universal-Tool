import * as Router from '../../Router/main.js';
import { Process } from '../../Process/main.js';
import { createQueueItem, generateToken, Token } from '../../Queue/main.js';

Router.post('/api/crop', (req: any, res: any) => {
    // if(!canDoApiRequest(req)) {
    //     res.status(404).json({
    //         message: 'Too many requests'
    //     })
    // }

    let file: string = req.body.file?.replaceAll('\\', '/').split('/').pop();
    let x: string = req.body.x?.toString();
    let y: string = req.body.y?.toString();
    let width: string = req.body.width?.toString();
    let height: string = req.body.height?.toString();

    if(!file || !x || !y || !width || !height || typeof file !=  'string' || typeof x !=  'string' || typeof y !=  'string' || typeof width !=  'string' || typeof height !=  'string') {
        return res.status(400).send(`Invalid request body`);
    }

    let token: string = createQueueItem({
        action: 'video / crop',
        next: 'video',
    });

    res.status(200).json({
        token: token
    });

    let outFile: Token = generateToken();
    let process = new Process('crop', token, ['public\\temp', file, outFile + '.mp4', x, y, width, height]);
});