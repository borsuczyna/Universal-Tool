const express = require('express');
app = express.Router();
const queue = {};

generateToken = (length = 24) => {
    let chars = 'qwertyuiopasdsfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXXCCVBNBM1234567890';
    let token = '';

    for(let i = 0; i < length; i++) {
        token += chars.charAt(Math.random()*chars.length);
    }

    return token;
};

outputConsole = (token, type, message) => {
    if(!queue[token]) return;

    queue[token].console.push([type, message]);
};

createQueueItem = (data) => {
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
};

setProgress = (token, progress) => {
    if(!queue[token]) return;
    
    queue[token].progress = progress;
};

setFinish = (token, file) => {
    if(!queue[token]) return;

    queue[token].finished = file;
};

getQueueItem = (token) => {
    return queue[token];
};

removeQueueItem = (token) => {
    delete queue[token];
};

app.get('/queue', async (req, res) => {
    let item = getQueueItem(req.query.token);
    if(!req.query.token || !item) {
        res.redirect('/');
        return;
    }

    let page = await Render('page', __dirname, item);
    res.send(page);
});

app.get('/api/queue', async (req, res) => {
    let item = getQueueItem(req.query.token);
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

module.exports = app;