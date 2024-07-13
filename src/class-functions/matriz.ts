import { Canvas } from "fabric/fabric-impl";
import { NSuperFabric } from "../model";

export class MatrizManager {
    constructor(private canvas: Canvas, options?: NSuperFabric.NMatriz.IMatrizOptions) {

    }
}

//Quando se utiliza a função matriz são desenhados retangulos no fundo, então é necessário alterar os cursores também
// this.rectanglesMatriz.forEach((rect) => {
//     rect.hoverCursor = urlCursor;
// })