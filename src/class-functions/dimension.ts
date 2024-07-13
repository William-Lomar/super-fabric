import { fabric } from "fabric";
import { NSuperFabric } from "../model";
import { DebounceTime } from "../utils";

type Orientacao = NSuperFabric.NDimension.EOrientacao;
const EOrientacao = NSuperFabric.NDimension.EOrientacao;

/**
 * Classe para tratar as dimensões do canvas, formato A4, A3 ou customizado
 */
export class DimensionManager {
    private orientacao: Orientacao = EOrientacao.VERTICAL
    /** Y(height) / X(width) */
    private factor: number

    constructor(
        private canvas: fabric.Canvas,
        private divContainer: HTMLElement,
        options?: NSuperFabric.NDimension.IDimensionConfigs
    ) {
        let newWidth: number, newHeight: number;

        if (options) {
            this.orientacao = options.orientacao;
            let width: number, height: number;
            switch (options.formato) {
                case NSuperFabric.NDimension.EFormatos.A4:
                    width = options.orientacao == EOrientacao.VERTICAL ? 210 : 297;
                    height = options.orientacao == EOrientacao.VERTICAL ? 297 : 210;
                    break;

                case NSuperFabric.NDimension.EFormatos.Custom:
                    width = options.width ?? divContainer.offsetWidth;
                    height = options.height ?? divContainer.offsetHeight;
                    break;

                default:
                    throw new Error("Dimension Value não reconhecido");
                    break;
            }

            this.factor = height / width;
            newWidth = this.calcularNovoWidth();
            newHeight = newWidth * this.factor;
        } else {
            //No primeiro momento simplesmente, se não for passado um fator a nova area no primeiro momento simplesmente será a area disponivel
            this.factor = divContainer.offsetHeight / divContainer.offsetWidth;
            newWidth = divContainer.offsetWidth;
            newHeight = divContainer.offsetHeight;
        }

        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);

        const debounce = new DebounceTime(50);
        //Atualizando dinamicamente a area de desenho quando o usuario mudar o tamanho da tela
        const observer = new ResizeObserver(() => {
            debounce.exec(this.atualizarArea.bind(this));
        })

        observer.observe(divContainer);
    }

    rotacionar() {
        if (this.orientacao == EOrientacao.VERTICAL) this.setOrientacao(EOrientacao.HORIZONTAL);
        else if (this.orientacao == EOrientacao.HORIZONTAL) this.setOrientacao(EOrientacao.VERTICAL);
    }

    setOrientacao(orientacao: Orientacao) {
        if (this.orientacao != orientacao) {
            this.orientacao = orientacao;
            this.factor = 1 / this.factor;

            const newWidth = this.calcularNovoWidth();
            const newHeight = newWidth * this.factor;

            this.canvas.setWidth(newWidth);
            this.canvas.setHeight(newHeight);
            this.canvas.renderAll();
        };
    }

    private atualizarArea() {
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
     * Aumenta/diminui todo o conteudo do canvas de acordo com o multiplicador passado
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