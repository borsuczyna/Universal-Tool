import { ChildProcess, spawn } from "child_process";
import { Token, setProgress, setFinish, outputConsole } from "../Queue/main.js";
import { outputLog } from '../Log/main.js';
import config from '../../config.json' assert {type: 'json'};

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { removeTempFile } from '../Public/main.js';

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const __maindir: string = __dirname.replaceAll('\\', '/').split('/').slice(0, -2).join('\\');

const regex: {[index: string]: RegExp} = {
    moviepyProgress: /t:[a-zA-Z0-9% ]*\|[a-zA-Z0-9%# ]*\| *([0-9]*)\/([0-9]*) *\[[0-9]*:[0-9]*<([0-9]*:[0-9]*)/,
};

const messageFromProcess = function(this: Process | FFMpegProcess, message: string) {
    let type = null;

    console.log(message);

    if(message.startsWith('[INFO] ')) {
        message = message.slice(7);
        type = 'info';
    } else if(message.startsWith('Press [q] to stop')) {
        message = 'Process started!'
        outputConsole(this.token, 'warning', 'Ffmpeg doesn\'t support process progress!');
        type = 'success';
    } else if(message.startsWith('[ERROR] ')) {
        message = message.slice(8);
        type = 'error';
    } else if(message.startsWith('[WARNING] ')) {
        message = message.slice(10);
        type = 'warning';
    } else if(message.startsWith('[SUCCESS] ')) {
        message = message.slice(10);
        type = 'success';
    } else if(/frame= *([0-9]+)/.test(message)) {
        let match: RegExpExecArray | null = /frame= *([0-9]+)/.exec(message);
        if(!match) return;

        let progress: number = parseInt(match[1]);
        setProgress(this.token, progress);
    } else if(/video:[0-9]*kB *audio/.test(message)) {
        if(this.savedFinish) {
            setFinish(this.token, this.savedFinish);
            setTimeout(removeTempFile, 5 * 60 * 1000, __maindir + `\\public\\temp\\${this.savedFinish}`);
        }
    } else if(/Output *#[0=9]*, *[a-zA-Z0-9]*, *to *'(.*)\\(.*)':/.test(message)) {
        let match: RegExpExecArray | null = /Output *#[0=9]*, *[a-zA-Z0-9]*, *to *'(.*)\\(.*)':/.exec(message);
        if(!match) return;

        let finish: string = match[2];
        this.savedFinish = finish;
    } else if(message.startsWith('[PROGRESS] ')) {
        message = message.slice(11);

        if(message.toString().length > 0) {
            let progress: number = parseInt(message);
            setProgress(this.token, progress);
        }
        return;
    } else if(message.startsWith('[DEBUG] ')) {
        message = message.slice(8);
        
        outputLog(`[${this.token}] ${message}`);

        return;
    } else if(message.startsWith('[FINISH] ')) {
        message = message.slice(9);
        setFinish(this.token, message);

        setTimeout(removeTempFile, 5 * 60 * 1000, __maindir + `\\public\\temp\\${message}`);

        return;
    } else if(regex.moviepyProgress.test(message)) {
        let match: RegExpExecArray | null = regex.moviepyProgress.exec(message);
        if(match) {
            let progress: number = parseInt(match[1])/parseInt(match[2]);
            setProgress(this.token, progress*100);
        }
        return;
    }

    if(!type) return;

    outputConsole(this.token, type, message);
}

const multipleMessages = function(this: Process, data: any) {
    let messages: string[] = data.toString('utf8').replaceAll(/(\r\n|\n|\r)/gm, '\n').split('\n').filter((a: string) => a.length > 0);

    for(let message of messages) {
        messageFromProcess.bind(this)(message);
    }
}

export class Process {
    token: Token;
    process: ChildProcess;
    savedFinish?: string | null;

    constructor(name: string, token: Token, params: string[]) {
        this.process = spawn('python.exe', [`python/${name}.py`, ...params]);
        this.token = token;

        outputConsole(this.token, 'INFO', 'Starting python process...');

        this.process?.stdout?.on('data', multipleMessages.bind(this));
        this.process?.stderr?.on('data', multipleMessages.bind(this));
    }
}

export class FFMpegProcess {
    token: Token;
    process: ChildProcess;
    savedFinish?: string | null;

    constructor(token: Token, params: string[]) {
        this.process = spawn('ffmpeg.exe', [...params]);
        this.token = token;

        console.log(params.join(' '))

        outputConsole(this.token, 'INFO', 'Starting ffmpeg process...');

        this.process?.stdout?.on('data', multipleMessages.bind(this));
        this.process?.stderr?.on('data', multipleMessages.bind(this));
    }
}