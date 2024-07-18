import { Canvas } from "fabric/fabric-impl";
import { downloadFile, uploadJson } from "../utils";

export class SaveManager {
    constructor(private canvas: Canvas) { }

    save() {
        const json = this.canvas.toJSON();
        downloadFile(json, 'superfabric.json');
    }

    open(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {   
                const fileProject = await uploadJson();
                this.canvas.loadFromJSON(fileProject, () => {
                    resolve();
                })
            } catch (error) {
                reject(error);
            }
        })
    }
}