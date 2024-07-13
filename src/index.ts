import { autoReload } from "./decorators/auto-reload";
import { FloodFill } from "./class-functions/flood-fill";
import { NSuperFabric } from "./model";
import { fabric } from 'fabric';
import { DimensionManager } from "./class-functions/dimension";
import { Color } from "fabric/fabric-impl";

//Classes e funções que a lib também irá disponibilizar
export { NSuperFabric } from "./model";
export { fabric } from 'fabric';

export class SuperFabric {
    /** Div onde está contido o fabric */
    private areaCanvas: HTMLElement;
    /** Canvas Fabric element */
    private canvas: fabric.Canvas;

    //Props
    /** Cor que será utiliza  */
    /**Usado para identificar qual a ferramenta que está selecionada */
    private funcaoAtiva: NSuperFabric.EFuncoes = NSuperFabric.EFuncoes.Selecionar;
    private cor: Color = new fabric.Color('rgb(0,0,0)'); // Inicia com a cor branca

    //Class functions
    private floodFill: FloodFill;
    private dimensionManager: DimensionManager;

    /**'
     * Usado initialize para habilitar o uso de funções assincronas no momento da construção do SuperFabric
     * @param id ID da div onde será instanciado o SuperFabric 
     * @param options 
     * @returns 
     */
    static async initialize(id: string, options?: NSuperFabric.IOptions): Promise<SuperFabric> {
        return new SuperFabric(id, options);
    }

    private constructor(id: string, options?: NSuperFabric.IOptions) {
        //Definindo o delimitador da area que será utilizada pelo canvas
        const areaCanvas = document.getElementById(id);
        if (!areaCanvas) throw new Error("Div onde será instanciado o fabric não encontrado!");
        this.areaCanvas = areaCanvas;

        //Criando elemento canvas dentro da div
        const canvas = document.createElement('canvas');
        canvas.id = id + '-canvas';
        this.areaCanvas.appendChild(canvas);

        //Instanciando fabric no canvas
        this.canvas = new fabric.Canvas(canvas, options);

        //Definindo configs inicias
        if (options?.cor) this.cor = new fabric.Color(options.cor);

        //Definindo funções 
        this.floodFill = new FloodFill(this.canvas, 20);
        this.dimensionManager = new DimensionManager(this.canvas, this.areaCanvas, options?.dimensionsConfigs);
    }

    //* Metodos públicos
    getCanvas(): fabric.Canvas {
        return this.canvas;
    }

    /**
     * Configura o icone do mouse do fabric
     * @param url Todo cursor deve vim de uma url ou ser none (Nenhum)
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
        //Quando se utiliza a função matriz são desenhados retangulos no fundo, então é necessário alterar os cursores também
        // this.rectanglesMatriz.forEach((rect) => {
        //     rect.hoverCursor = urlCursor;
        // })

        this.canvas.getObjects().forEach((obj) => {
            obj.hoverCursor = urlCursor;
        })
    }

    setCor(cor: string) {
        this.cor = new fabric.Color(cor);
        console.log(this.cor);
        
    }

    setBackgroundColor(color: string, callback?: Function) {
        this.canvas.setBackgroundColor(color, () => {
            if (typeof callback == 'function') callback();
            this.reload();
        });
    }

    /**
     * Seta função que altera o status da função atual da instancia
     * @param funcao 
     */
    setFuncaoAtiva(funcao: NSuperFabric.EFuncoes) {
        this.funcaoAtiva = funcao;
        this.desabilitarTodasFuncoes();

        switch (funcao) {
            case NSuperFabric.EFuncoes.Selecionar:
                break;

            case NSuperFabric.EFuncoes.FloodFill:
                this.floodFill.enable(this.cor.toHexa());
                break;

            default:
                throw new Error("Função solicitada não está mapeada")
                break;
        }
    }

    setOrientacao(orientacao: NSuperFabric.NDimension.EOrientacao) {
        this.dimensionManager.setOrientacao(orientacao);
    }

    rotacionar() {
        this.dimensionManager.rotacionar();
    }

    //* Metodos privados

    /**
    * Desabilita todas as ferramentas quando a função selecionar for chamada e sempre que uma nova ferramenta for ser utilizada
    */
    private desabilitarTodasFuncoes() {
        this.floodFill.disable();
    }

    /**
     * Renderiza novamente o editor/canvar aplicando todas as alterações
     */
    private reload() {
        this.canvas.renderAll();
    }
}
