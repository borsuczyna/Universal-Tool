import fs from 'fs';
import { fileTypeFromFile, MimeType, FileTypeResult } from 'file-type';

export type FileType = string;

export const fileTypes: {[index: FileType]: string[]} = {
    'Video': ['video/mp4'],
};

export async function readFile(path: string): Promise<string> {
    return new Promise((resolve: CallableFunction, reject: CallableFunction) => {
        fs.readFile(path, 'utf8', (err: any, data: string) => {
            if(err) reject(err);
            resolve(data);
        });
    });
}

export async function fileType(path: string): Promise<MimeType | undefined> {
    const type: FileTypeResult | undefined = await fileTypeFromFile(path);
    return type?.mime;
}

export async function easyFileType(path: string): Promise<FileType | boolean> {
    const type: MimeType | undefined = await fileType(path);
    if(!type) return false;

    for(let t in fileTypes) {
        if(fileTypes[t]?.includes(type)) {
            return t;
        }
    }

    return false;
}