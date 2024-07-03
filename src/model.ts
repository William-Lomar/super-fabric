import { Canvas, IImageOptions, Image, CircleBrush, PencilBrush, ICanvasOptions, IObjectOptions, IUtil } from "fabric/fabric-impl";

export namespace NSuperFabric {
    export enum EFuncoes {
        Selecionar = 1,
        FloodFill
    }

    export interface IOptions extends ICanvasOptions {
        configsA4?: IConfigsA4,
        cor?: string
    }

    export enum EOrientacao {
        VERTICAL = 'vertical',
        HORIZONTAL = 'horizontal'
    }

    export interface IConfigsA4 {
        orientacao: EOrientacao,
        nLinhas: number,
        nColunas: number
    }
}