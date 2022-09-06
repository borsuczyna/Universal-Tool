import {readFile} from '../File/main.js';

export async function Render(path: string): Promise<string> {
    let html: string = await readFile('scripts/Render/Template/main.ejs');

    return html;
}