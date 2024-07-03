/**
 *  @typedef {import('./dist-typescript/index').SuperFabric} SuperFabric
 *  @typedef {import('./dist-typescript/index').fabric} fabric
 *  @typedef {import('./dist-typescript/index').NSuperFabric} NSuperFabric
 * 
*/

/** * @type {SuperFabric} */
const SuperFabric = SuperFabricLibrary.SuperFabric

/** * @type {fabric} */
const fabric = SuperFabricLibrary.fabric

/** * @type {NSuperFabric} */
const NSuperFabric = SuperFabricLibrary.NSuperFabric

/**
 * @param {SuperFabric} superfabric 
 * A ideia deste pequeno projeto é testar apenas a funcionalidade que se está desenvolvendo
 * Uma aplicação de demonstração com todas as funcionalidades disponiveis será criada com React
 */
function casoTeste(superfabric) {
    console.log("Testando superfabric: ", NSuperFabric);
    const canvas = superfabric.getCanvas();

    var rect = new fabric.Rect({
        left: 100,
        top: 50,
        width: 100,
        height: 100,
        angle: 20,
        padding: 10,
        fill: 'rgba(0,0,0,0)',
        stroke: 'red'
    });
    canvas.add(rect);

    setTimeout(() => {
        superfabric.setCor("#FF0000");
        superfabric.setFuncaoAtiva(NSuperFabric.EFuncoes.FloodFill);
    }, 150);
}

SuperFabric.initialize('canvas').then((superfabric) => {
    const headerHTML = document.getElementById('text-header')
    if (headerHTML) headerHTML.innerHTML += ' - Instanciado com sucesso!';

    const btnHTML = document.getElementById('btn');
    btnHTML.onclick = () => { casoTeste(superfabric) }
    document.getElementById('btn').disabled = false;
}).catch((err) => {
    console.error("Ocorreu um erro ao inicializar o canvas: ", err);
    const headerHTML = document.getElementById('header')
    if (headerHTML) headerHTML.innerHTML = 'Ocorreu um erro ao inicializar o canvas!';
})

