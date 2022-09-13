import config from './config.json' assert {type: 'json'};
import * as Router from './scripts/Router/main.js';

// Init router
Router.init(config.port);

// ********** WHOLE BACKEND ********** \\
// Public directory
import('./scripts/Public/main.js');

// Uploader
import('./scripts/Uploader/main.js');

// Homepage
import('./scripts/Home/main.js');

// Video
import('./scripts/Video/main.js');