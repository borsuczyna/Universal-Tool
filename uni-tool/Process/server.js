import {spawn} from 'child_process';
const regex = {
    moviepyProgress: /t:[a-zA-Z0-9% ]*\|[a-zA-Z0-9%# ]*\| *([0-9]*)\/([0-9]*) *\[[0-9]*:[0-9]*<([0-9]*:[0-9]*)/,
};

const messageFromProcess = function(data) {
    let message = data.toString('utf8');
    let type = null;

    if(message.startsWith('[INFO] ')) {
        message = message.slice(7);
        type = 'info';
    } else if(message.startsWith('[ERROR] ')) {
        message = message.slice(8);
        type = 'error';
    } else if(message.startsWith('[WARNING] ')) {
        message = message.slice(10);
        type = 'warning';
    } else if(message.startsWith('[SUCCESS] ')) {
        message = message.slice(10);
        type = 'success';
    } else if(message.startsWith('[PROGRESS] ')) {
        message = message.slice(11);
        message = parseInt(message);
        if(message.toString().length > 0) {
            setProgress(this.token, message);
        }
        return;
    } else if(message.startsWith('[DEBUG] ')) {
        message = message.slice(8);
        console.log(`[DEBUG] [${this.token}] ${message}`);
        return;
    } else if(message.startsWith('[FINISH] ')) {
        message = message.slice(9);
        setFinish(this.token, message);
        return;
    } else if(regex.moviepyProgress.test(message)) {
        let match = regex.moviepyProgress.exec(message);
        if(match) {
            let progress = parseInt(match[1])/parseInt(match[2]);
            let remaining = match[3];
            setProgress(this.token, progress*100);
        }
        return;
    }

    if(!type) return;

    outputConsole(this.token, type, message);
}

const multipleMessages = function(data) {
    let messages = data.toString('utf8').replaceAll(/(\r\n|\n|\r)/gm, '\n').split('\n').filter(a => a.length > 0);

    for(let message of messages) {
        messageFromProcess.bind(this)(message);
    }
}

class Process {
    constructor(name, token, params) {
        this.process = spawn('python.exe', [`python/${name}.py`, ...params]);
        this.token = token;

        this.process.stdout.on('data', multipleMessages.bind(this));
        this.process.stderr.on('data', multipleMessages.bind(this));
    }
}

global.Process = Process;

// var spawn = require("child_process").spawn;
// var process = spawn('python.exe', ['python/cut.py']);

// process.stdout.on('data', function(data) {
//     console.log(data.toString());
// } )