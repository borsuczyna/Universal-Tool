import express from 'express';

var app: any = null;

export async function init(port: number = 3000) {
    app = express();

    await new Promise((resolve: CallableFunction) => {
        app.listen(port, () => {
            console.log(`Listening on port ${port}...`);
            resolve();
        });
    });
}

export function get(path: string, callback: (req: any, res: any) => void) {
    if(app == null) throw new Error('Attempt to add routing without initializing it, use Router.init();');

    app.get(path, callback);
}

export function post(path: string, callback: (req: any, res: any) => void) {
    if(app == null) throw new Error('Attempt to add routing without initializing it, use Router.init();');

    app.post(path, callback);
}