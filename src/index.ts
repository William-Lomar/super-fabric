import { autoReload } from "./decorators/auto-reload";
import { FloodFill } from "./class-functions/flood-fill";
import { NSuperFabric } from "./model";
import { fabric } from 'fabric';
import { DimensionManager } from "./class-functions/dimension";
import { Color } from "fabric/fabric-impl";
import { MatrizManager } from "./class-functions/matriz";
import { SaveManager } from "./class-functions/save";

//Classes and functions that the lib will also make available
export { NSuperFabric } from "./model";
export { fabric } from 'fabric';

export class SuperFabric {
    /** Div where the fabric is contained */
    private divContainer: HTMLElement;
    /** Canvas Fabric element */
    private canvas: fabric.Canvas;

    //Props
    /** Used to identify which function is selected */
    private activeFunction: NSuperFabric.EFunctions = NSuperFabric.EFunctions.Select;
    /** Color that will be used */
    private color: Color = new fabric.Color('rgb(0,0,0)'); //init white

    //Class functions
    private floodFill: FloodFill;
    private dimensionManager: DimensionManager;
    private matrizManager: MatrizManager;
    private saveManager: SaveManager;

    /**'
     * Used initialize to enable the use of asynchronous functions at SuperFabric build time
     * @param id ID of the div where SuperFabric will be instantiated
     * @param options 
     * @returns 
     */
    static async initialize(id: string, options?: NSuperFabric.IOptions): Promise<SuperFabric> {
        return new SuperFabric(id, options);
    }

    private constructor(id: string, options?: NSuperFabric.IOptions) {
        //Defining the delimiter of the area that will be used by the canvas
        const divContainer = document.getElementById(id);
        if (!divContainer) throw new Error("Div where the fabric will be instantiated not found!");
        this.divContainer = divContainer;

        //Creating canvas element inside the div
        const canvas = document.createElement('canvas');
        canvas.id = id + '-canvas';
        this.divContainer.appendChild(canvas);

        //Instantiating fabric on canvas
        this.canvas = new fabric.Canvas(canvas, options);

        //Defining initial settings
        if (options?.color) this.color = new fabric.Color(options.color);

        //Defining funcitons and managers
        this.floodFill = new FloodFill(this.canvas, 20);
        this.dimensionManager = new DimensionManager(this.canvas, this.divContainer, options?.dimensionsOptions);
        this.matrizManager = new MatrizManager(this.canvas, options?.matrizOptions);
        this.saveManager = new SaveManager(this.canvas);
    }

    //* Public methods
    getCanvas(): fabric.Canvas {
        return this.canvas;
    }

    /**
     * @param url Every cursor must come from a url or be none
     */
    @autoReload
    setMouseIcon(url: string | 'none', center?: { x: number, y: number }) {
        let urlCursor = '';

        if (url == 'none') {
            urlCursor = url
        } else {
            urlCursor = center ? `url("${url}") ${center.x} ${center.y}, auto` : `url("${url}"), auto`;
        }

        this.canvas.defaultCursor = urlCursor;
        this.canvas.getObjects().forEach((obj) => {
            obj.hoverCursor = urlCursor;
        })
    }

    setColor(color: string) {
        this.color = new fabric.Color(color);
    }

    setBackgroundColor(color: string, callback?: Function) {
        this.canvas.setBackgroundColor(color, () => {
            if (typeof callback == 'function') callback();
            this.reload();
        });
    }

    /**
     * Arrow function that changes the status of the current function of the instance
     * @param func 
     */
    setActiveFunction(func: NSuperFabric.EFunctions) {
        this.activeFunction = func;
        this.disableAllFunctions();

        switch (func) {
            case NSuperFabric.EFunctions.Select:
                break;

            case NSuperFabric.EFunctions.FloodFill:
                this.floodFill.enable('#' + this.color.toHex());
                break;

            default:
                throw new Error("Requested function is not mapped");
                break;
        }
    }

    setOrientation(orientation: NSuperFabric.NDimension.EOrientation) {
        this.dimensionManager.setOrientation(orientation);
    }

    rotate() {
        this.dimensionManager.rotate();
    }

    save() {
        this.saveManager.save();
    }

    open(): Promise<void> {
        return this.saveManager.open();
    }

    //* Private methods

    /**
    * Disables all tools when the select function is called and whenever a new tool is to be used
    */
    private disableAllFunctions() {
        this.floodFill.disable();
    }

    /**
     * Rerender the editor/canva applying all changes
     */
    private reload() {
        this.canvas.renderAll();
    }
}
