import { ICanvasOptions } from "fabric/fabric-impl";

export namespace NSuperFabric {
    export enum EFuncoes {
        Selecionar = 1,
        FloodFill
    }

    export interface IOptions extends ICanvasOptions {
        dimensionsConfigs?: NDimension.IDimensionConfigs,
        cor?: string
    }

    export namespace NDimension {
        export enum EOrientacao {
            VERTICAL = 'vertical',
            HORIZONTAL = 'horizontal'
        }

        export enum EFormatos {
            A4 = 1,
            Custom
        }

        export interface IDimensionConfigs {
            orientacao: EOrientacao,
            formato: EFormatos,
            /** Tempo de debounce para dar o resize no canvas em milisegundos quando ocorrer uma alteração na divContainer que irá conter o canvas, default 50 ms */
            debounceTime?: number, 
            width?: number
            height?: number
        }
    }
}