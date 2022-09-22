import * as Router from '../Router/main.js';
import { Render } from '../Render/main.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
Router.get('/', async (req, res) => {
    let code = await Render('page', __dirname, {}, false);
    res.send(code);
});
