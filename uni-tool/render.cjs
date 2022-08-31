const fs = require('fs');
const ejs = require('ejs');

readFile = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
}

Render = async (path, dataPath, props, isTemplate = false) => {
    let data = await readFile(`${dataPath}\\${path}.ejs`);

    let works = [
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

    for(let work of works) {
        let found = data.match(work.regex);
        if(found) found = found[0];

        while(found) {
            let pos = data.indexOf(found);
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

            let after = data.slice(pos + found.length);

            if(work.multiLineString) {
                let code = data.slice(pos+2);
                code = code.slice(0, code.indexOf('``'));
                after = data.slice(pos + found.length + code.length + 2);
                code = code.replaceAll(/(\r\n|\n|\r)/gm, "");
                code = code.replaceAll('  ', '');

                final = final.replace('{data}', code);
            }

            final = final.replace('{before}', data.slice(0, pos));
            final = final.replace('{after}', after);

            data = final;
            
            found = data.match(work.regex);
            if(found) found = found[0];
        }
    }
    
    if(!isTemplate) {
        let template = await RenderTemplate();
        data = template.replace('<pageBody/>', data);
        
        let uploader = await RenderUploader();
        data = data.replace('<fileUploader/>', uploader);
    }
    
    data = ejs.render(data, props);
    
    return data;
}