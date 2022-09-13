import { readFile } from '../File/main.js';
import { renderTemplate } from './Template/main.js'
import { renderUploader } from './Uploader/main.js';
import ejs from 'ejs';

const renderWorks = [
    {
        regex: /<include type="style" src="(.*?)"\/>/g,
        final: '{before}<style>{content}</style>{after}',
        file: true,
    },
    {
        regex: /<include type="script" src="(.*?)"\s*(defer)?\/>/g,
        final: '{before}<script {defer}>{content}</script>{after}',
        file: true,
        defer: true,
    },
    {
        regex: /<include type="ejs-script" src="(.*?)"\s*(defer)?\/>/g,
        final: '{before}<% {content} %>{after}',
        file: true,
    },
    {
        regex: /``/gm,
        final: '{before}"{data}"{after}',
        multiLineString: true,
    },
    {
        regex: /<videoPlayer src=("|')([a-zA-Z0-9\/.,_<>%= -]*)("|')(.*)\/>/g,
        final: `{before}
        <video{options}>
            <source src="{url}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        {after}`,
        player: true,
    },
];

export async function Render(path: string, dataPath: string, props: any = {}, isTemplate: boolean): Promise<string> {
    let html: string = await readFile(`${dataPath}\\${path}.ejs`);

    for(let work of renderWorks) {
        let found: any = html.match(work.regex);
        if(found) found = found[0];

        while(found) {
            let pos = html.indexOf(found);
            let path = found.replace(work.regex, '$1');
            let defer = found.includes('defer');
            
            let final = work.final;
            if(path && work.file) {
                let script = await readFile(`${dataPath}\\${path}`);

                final = final.replace('{content}', script);
            }

            if(work.defer) {
                final = final.replace('{defer}', defer ? 'defer' : '');
            }

            if(work.player) {
                let url = found.replace(work.regex, '$2');
                let options = found.replace(work.regex, '$4');
                final = final.replace('{url}', url);
                final = final.replace('{options}', options);
            }

            let after = html.slice(pos + found.length);

            if(work.multiLineString) {
                let code: any = html.slice(pos+2);
                code = code.slice(0, code.indexOf('``'));
                after = html.slice(pos + found.length + code.length + 2);
                code = code.replaceAll(/(\r\n|\n|\r)/gm, "");
                code = code.replaceAll('  ', '');

                final = final.replace('{data}', code);
            }

            final = final.replace('{before}', html.slice(0, pos));
            final = final.replace('{after}', after);

            html = final;
            
            found = html.match(work.regex);
            if(found) found = found[0];
        }
    }

    if(!isTemplate) {
        let template: string = await renderTemplate();
        html = template.replace('<pageBody/>', html);
        
        let uploader: string = await renderUploader();
        html = html.replace('<fileUploader/>', uploader);
    }
    
    html = ejs.render(html, props || {});

    return html;
}