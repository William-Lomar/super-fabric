import { NSuperFabric } from "./model";

export function asyncTimeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export class DebounceTime {
    private timeout?: NodeJS.Timeout;

    constructor(private ms: number) { }

    exec(func: () => void) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(func, this.ms);
    }
}

export function downloadFile(file: object, name: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(file));
    downloadLink.download = name;
    downloadLink.click();
}

export function uploadJson(): Promise<Object> {
    return new Promise<Object>((resolve, reject) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.click();

        fileInput.oninput = () => {
            try {
                let file;
                if (fileInput.files?.length) file = fileInput.files[0];

                if (!file) throw new Error("File not found!");
                if (file.type != 'application/json') throw new Error("Invalid type!");
                readJsonFile(file).then((fileContent) => {
                    resolve(fileContent);
                }).catch((error) => {
                    reject(error);
                })
            } catch (error) {
                reject(error);
            }
        }
    })
}

export function readJsonFile(file: File): Promise<Object> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                if (event.target?.result) {
                    const jsonData = JSON.parse(String(event.target.result));
                    resolve(jsonData);
                } else {
                    reject("Empty file!");
                }
            } catch (error) {
                reject(error);
            }
        }

        reader.readAsText(file);
    })
}