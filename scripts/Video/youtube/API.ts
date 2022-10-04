import { Render } from '../../Render/main.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname: string = dirname(fileURLToPath(import.meta.url));

export async function handleRequest(req: any, res: any) {
    let page: string = await Render('page', __dirname, {}, false);
    res.send(page);
}