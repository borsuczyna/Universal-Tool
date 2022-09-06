import * as Router from '../Router/main.js';
import {Render} from '../Render/main.js';

Router.get('/', async (req, res) => {
    let code = await Render('');
    res.send(code);
});