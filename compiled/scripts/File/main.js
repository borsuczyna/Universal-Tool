import fs from 'fs';
import { fileTypeFromFile } from 'file-type';
export const fileTypes = {
    'Video': ['video/mp4'],
};
export async function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
}
export async function fileType(path) {
    const type = await fileTypeFromFile(path);
    return type?.mime;
}
export async function easyFileType(path) {
    const type = await fileType(path);
    if (!type)
        return false;
    for (let t in fileTypes) {
        if (fileTypes[t]?.includes(type)) {
            return t;
        }
    }
    return false;
}
