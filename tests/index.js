/**
 *  @typedef {import('./dist-typescript/index').SuperFabric} SuperFabric
 *  @typedef {import('./dist-typescript/index').fabric} fabric
 *  @typedef {import('./dist-typescript/index').NSuperFabric} NSuperFabric
 *  @typedef {import('./dist-typescript/index').NSuperFabric.IOptions} IOptions
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
    
    const r = new fabric.Rect({
        width: 50,
        height: 50,
        fill: 'red'
    })
    
    superfabric.getCanvas().add(r);
    
    
    
    superfabric.setColor('green');
    superfabric.setActiveFunction(2)

}

/** * @type {IOptions} */
const options = {
    dimensionsConfigs: {
        orientacao: 'vertical',
        formato: 1
    }
}

SuperFabric.initialize('canvas', options).then((superfabric) => {
    const headerHTML = document.getElementById('text-header')
    if (headerHTML) headerHTML.innerHTML += ' - Instanciado com sucesso!';

    const btnHTML = document.getElementById('btn');
    btnHTML.onclick = () => { casoTeste(superfabric) }
    document.getElementById('btn').disabled = false;


    superfabric.setBackgroundColor("blue");
}).catch((err) => {
    console.error("Ocorreu um erro ao inicializar o canvas: ", err);
    const headerHTML = document.getElementById('header')
    if (headerHTML) headerHTML.innerHTML = 'Ocorreu um erro ao inicializar o canvas!';
})

