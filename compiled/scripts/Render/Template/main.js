import { Render } from '../main.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function renderTemplate() {
    let page = await Render('main', __dirname, null, true);
    return page;
}
