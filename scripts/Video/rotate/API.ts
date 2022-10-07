import * as Router from '../../Router/main.js';
import { Process } from '../../Process/main.js';
import { createQueueItem, generateToken, Token } from '../../Queue/main.js';

type ActionCallback = (token: Token, args: any[]) => Process;
interface ActionList {
    [key: string]: ActionCallback;
};

const actions: ActionList = {
    'rotate-90-right': (token: Token, args: any[]) => {
        let process: Process = new Process('rotate', token, [...args, 90]);
        return process;
    },
    'rotate-90-left': (token: Token, args: any[]) => {
        let process: Process = new Process('rotate', token, [...args, -90]);
        return process;
    },
    'rotate-180': (token: Token, args: any[]) => {
        let process: Process = new Process('rotate', token, [...args, 180]);
        return process;
    },
    'mirror-horizontally': (token: Token, args: any[]) => {
        let process: Process = new Process('mirror', token, [...args, 'horizontally']);
        return process;
    },
    'mirror-vertically': (token: Token, args: any[]) => {
        let process: Process = new Process('mirror', token, [...args, 'vertically']);
        return process;
    },
}

Router.post('/api/rotate', (req: any, res: any) => {
    // if(!canDoApiRequest(req)) {
    //     res.status(404).json({
    //         message: 'Too many requests'
    //     })
    // }

    let file: string = req.body.file?.replaceAll('\\', '/').split('/').pop();
    let type: string = req.body.type;

    if(!file || typeof file !=  'string' || !type || typeof type != 'string' || actions[type] == undefined) {
        return res.status(400).send(`Invalid request body`);
    }

    let action: ActionCallback = actions[type];

    let token: string = createQueueItem({
        action: 'video / rotate',
        next: 'video',
    });

    res.status(200).json({
        token: token
    });
    

    let outFile: Token = generateToken();
    let process: Process = action(token, ['public\\temp', file, outFile + '.mp4']);
});