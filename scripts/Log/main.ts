import config from '../../config.json' assert {type: 'json'};
import fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __maindir: string = __dirname.replaceAll('\\', '/').split('/').slice(0, -2).join('\\');

const logsLocation: string = config?.logsLocation || 'logs/';
const logFileName: string = config?.logFileName || "{month}.{day}.{year} {hour}.{minute}.{second}.log";
var logFile: string;

function $02d(a: number) {
    return (a < 10 ? `0${a}` : `${a}`);
}

async function initLogFile(): Promise<void> {
    if(logFile) return;

    const time = new Date();
    logFile = logFileName
        .replace('{day}', $02d(time.getDay()))
        .replace('{month}', $02d(time.getMonth()))
        .replace('{year}', $02d(time.getFullYear()))
        .replace('{hour}', $02d(time.getHours()))
        .replace('{minute}', $02d(time.getMinutes()))
        .replace('{second}', $02d(time.getSeconds()));

    logFile = `${__maindir}\\${logsLocation}${logFile}`;

    await fs.writeFileSync(logFile, '# LOG START\n');
}

export async function outputLog(...args: string[]): Promise<void> {
    if(config.outputLogsToConsole) {
        const time = new Date();
        let timeFormat = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        console.log(`[${timeFormat}] ${args.join('   ')}`);
    }

    fs.appendFileSync(logFile, args.join('\n'));
}

initLogFile();
outputLog('test');