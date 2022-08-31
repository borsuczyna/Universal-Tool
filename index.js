import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.json());

const useRouting = async (path) => {
    let data = await import(path);
    app.use('/', data.default);
};

// Database
import './uni-tool/Database/server.cjs';

// Rendering a template
import './uni-tool/file.cjs';
import './uni-tool/render.cjs';

// Template
import './uni-tool/Template/main.cjs';

// File Uploader
import './uni-tool/File Uploader/main.cjs'; 

// Handling file uploading
useRouting('./uni-tool/Uploader/server.cjs');

// Process
import './uni-tool/Process/server.js';

// Pages
useRouting('./uni-tool/Home/server.cjs');
useRouting('./uni-tool/Video/server.cjs');
useRouting('./uni-tool/Queue/server.cjs');

// API
useRouting('./uni-tool/Video/cut/API.cjs');

function sendFile(req, res) {
    res.sendFile(__dirname + '/' + req.url);
}

app.get('/public/*', sendFile);

app.listen(3000, () => {
    console.log(`Listening...`);
})