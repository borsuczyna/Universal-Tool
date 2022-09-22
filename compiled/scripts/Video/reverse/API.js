import * as Router from '../../Router/main.js';
import { FFMpegProcess } from '../../Process/main.js';
import { createQueueItem, generateToken } from '../../Queue/main.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const __maindir = __dirname.replaceAll('\\', '/').split('/').slice(0, -3).join('\\');
Router.post('/api/reverse', (req, res) => {
    // if(!canDoApiRequest(req)) {
    //     res.status(404).json({
    //         message: 'Too many requests'
    //     })
    // }
    let file = req.body.file?.replaceAll('\\', '/').split('/').pop();
    if (!file || typeof file != 'string') {
        return res.status(400).send(`Invalid request body`);
    }
    let token = createQueueItem({
        action: 'video / reverse',
        next: 'video',
    });
    res.status(200).json({
        token: token
    });
    let outFile = generateToken();
    let extension = file.split('.').pop();
    if (!extension || extension.length == 0)
        extension = 'mp4';
    let process = new FFMpegProcess(token, ['-i', `${__maindir}\\public\\temp\\${file}`, '-vf', 'reverse', '-af', 'areverse', `${__maindir}\\public\\temp\\${outFile}.${extension}`]);
});
