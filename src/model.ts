import { ICanvasOptions } from "fabric/fabric-impl";

export namespace NSuperFabric {
    export enum EFunctions {
        Select = 1,
        FloodFill
    }

    export interface IOptions extends ICanvasOptions {
        dimensionsOptions?: NDimension.IDimensionOptions,
        color?: string,
        matrizOptions: NMatriz.IMatrizOptions
    }

    export namespace NDimension {
        export enum EOrientation {
            Portrait = 'Portrait',
            Landscape = 'Landscape'
        }

        export enum EFormat {
            A4 = 1,
            Custom
        }

        export interface IDimensionOptions {
            orientation: EOrientation,
            format: EFormat,
            /** Debounce time to resize the canvas in milliseconds when a change occurs in the divContainer that will contain the canvas, default 50 ms */
            debounceTime?: number, 
            width?: number
            height?: number
        }
    }

    export namespace NMatriz {
        export interface IMatrizOptions {
            linhas: { colunas: number }[],
            showMargins: boolean,
            backgroundColor: string | fabric.Pattern | fabric.Gradient | fabric.Color
        }
    }
}