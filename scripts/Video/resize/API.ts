import * as Router from '../../Router/main.js';
import { Process } from '../../Process/main.js';
import { createQueueItem, generateToken, Token } from '../../Queue/main.js';

Router.post('/api/resize', (req: any, res: any) => {
    // if(!canDoApiRequest(req)) {
    //     res.status(404).json({
    //         message: 'Too many requests'
    //     })
    // }

    let file: string = req.body.file?.replaceAll('\\', '/').split('/').pop();
    let width: number = parseInt(req.body.width);
    let height: number = parseInt(req.body.height);

    console.log(width, height);

    if(!file || typeof file !=  'string' || !width || !height || typeof width != 'number' || typeof height != 'number' || width < 10 || height < 10) {
        return res.status(400).send(`Invalid request body`);
    }

    let token: string = createQueueItem({
        action: 'video / rotate',
        next: 'video',
    });

    res.status(200).json({
        token: token
    });
    

    let outFile: Token = generateToken();
    let process: Process = new Process('resize', token, ['public\\temp', file, outFile + '.mp4', width.toString(), height.toString()]);
});