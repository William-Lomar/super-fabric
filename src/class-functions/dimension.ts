import { fabric } from "fabric";
import { NSuperFabric } from "../model";
import { DebounceTime } from "../utils";

type Orientation = NSuperFabric.NDimension.EOrientation;
const EOrientation = NSuperFabric.NDimension.EOrientation;

/**
 * Class to handle canvas dimensions, A4, A3 or customized format
 */
export class DimensionManager {
    private orientation: Orientation = EOrientation.Portrait
    /** Y(height) / X(width) */
    private factor: number

    constructor(
        private canvas: fabric.Canvas,
        private divContainer: HTMLElement,
        options?: NSuperFabric.NDimension.IDimensionOptions
    ) {
        let newWidth: number, newHeight: number;

        if (options) {
            this.orientation = options.orientation;
            let width: number, height: number;
            switch (options.format) {
                case NSuperFabric.NDimension.EFormat.A4:
                    width = options.orientation == EOrientation.Portrait ? 210 : 297;
                    height = options.orientation == EOrientation.Portrait ? 297 : 210;
                    break;

                case NSuperFabric.NDimension.EFormat.Custom:
                    width = options.width ?? divContainer.offsetWidth;
                    height = options.height ?? divContainer.offsetHeight;
                    break;

                default:
                    throw new Error("Dimension Value not recognized");
                    break;
            }

            this.factor = height / width;
            newWidth = this.calcularNovoWidth();
            newHeight = newWidth * this.factor;
        } else {
            //At first, if a factor is not passed, the new area at first will simply be the available area.
            this.factor = divContainer.offsetHeight / divContainer.offsetWidth;
            newWidth = divContainer.offsetWidth;
            newHeight = divContainer.offsetHeight;
        }

        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);

        const debounce = new DebounceTime(50);
        //Dynamically updating the drawing area when the user changes the screen size
        const observer = new ResizeObserver(() => {
            debounce.exec(this.updateArea.bind(this));
        })

        observer.observe(divContainer);
    }

    rotate() {
        if (this.orientation == EOrientation.Portrait) this.setOrientation(EOrientation.Landscape);
        else if (this.orientation == EOrientation.Landscape) this.setOrientation(EOrientation.Portrait);
    }

    setOrientation(orientacao: Orientation) {
        if (this.orientation != orientacao) {
            this.orientation = orientacao;
            this.factor = 1 / this.factor;

            const newWidth = this.calcularNovoWidth();
            const newHeight = newWidth * this.factor;

            this.canvas.setWidth(newWidth);
            this.canvas.setHeight(newHeight);
            this.canvas.renderAll();
        };
    }

    private updateArea() {
        const canvas = this.canvas;
        const newWidth = this.calcularNovoWidth();

        if (canvas.width != newWidth) {
            const scaleMultiplier = newWidth / canvas.width!;
            this.scaleAll(scaleMultiplier);

            canvas.discardActiveObject();

            const widthAtualizado = canvas.getWidth() * scaleMultiplier;
            const heightAtualizado = canvas.getHeight() * scaleMultiplier;

            canvas.setWidth(widthAtualizado);
            canvas.setHeight(heightAtualizado);
            canvas.renderAll();
            canvas.calcOffset();
        }
    }

    private calcularNovoWidth(): number {
        let height: number = 0, width: number = this.divContainer.offsetWidth;

        height = width * this.factor;
        if (height > this.divContainer.offsetHeight) {
            height = this.divContainer.offsetHeight;
            width = height / this.factor;
        }

        return width;
    }

    /**
     * Increases/decreases the entire canvas content according to the passed multiplier
     * @param scaleMultiplier 
     */
    private scaleAll(scaleMultiplier: number) {
        const objects = this.canvas.getObjects();
        for (const i in objects) {
            objects[i].scaleX = objects[i].scaleX! * scaleMultiplier;
            objects[i].scaleY = objects[i].scaleY! * scaleMultiplier;
            objects[i].left = objects[i].left! * scaleMultiplier;
            objects[i].top = objects[i].top! * scaleMultiplier;
            objects[i].setCoords();
        }

        const obj = this.canvas.backgroundImage;
        if (obj instanceof fabric.Image) {
            obj.scaleX = obj.scaleX! * scaleMultiplier;
            obj.scaleY = obj.scaleY! * scaleMultiplier;
        }
    }
}