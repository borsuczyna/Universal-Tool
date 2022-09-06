import fs from 'fs';

export async function readFile(path: string): Promise<string> {
    return new Promise((resolve: CallableFunction, reject: CallableFunction) => {
        fs.readFile(path, 'utf8', (err: any, data: string) => {
            if(err) reject(err);
            resolve(data);
        });
    });
}