const fs = require('fs');

const signatures = {
    'mp4': '00000018667479706D70',
}

const signatureTypes = {
    'Video': ['mp4'],
}

fileType = (path) => {
    var parentDir = __dirname.split('\\');
    parentDir.pop();
    parentDir = parentDir.join('\\');
    
    if(!fs.existsSync(parentDir + '\\public\\temp\\' + path)) return 'Not exist';

    var file = fs.readFileSync(parentDir + '\\public\\temp\\' + path);
    var type = 'Not exist';

    for(var key in signatures) {
        if(file.toString('hex').toLowerCase().indexOf(signatures[key].toLowerCase()) == 0) {
            type = key;
            break;
        }
    }

    for(var key in signatureTypes) {
        if(signatureTypes[key].includes(type)) {
            type = key;
        }
    }

    return 'Video';

    return type;
}