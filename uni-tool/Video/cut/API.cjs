const express = require('express');
app = express.Router();

app.post('/api/cut', (req, res) => {
    // if(!canDoApiRequest(req)) {
    //     res.status(404).json({
    //         message: 'Too many requests'
    //     })
    // }

    let file = req.body.file?.replaceAll('\\', '/').split('/').pop();
    let start = req.body.start?.toString();
    let finish = req.body.finish?.toString();

    if(!file || !start || !finish || typeof file !=  'string' || typeof start !=  'string' || typeof finish !=  'string') {
        return res.status(400).send(`Invalid request body`);
    }

    let token = createQueueItem({
        action: 'video / cut',
        next: 'video',
    });

    res.status(200).json({
        token: token
    });

    let outFile = generateToken();
    let process = new Process('cut', token, ['public\\temp', file, outFile + '.mp4', req.body.start.toString(), req.body.finish.toString()]);
});

module.exports = app;