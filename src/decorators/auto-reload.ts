/**
 * Decorator criado para a classe SuperFabric
 * Sempre que a função for chamada irá renderizar novamente o editor, facilitando o desenvolvimento
 * Obs: aparentemente quando for um processo mais longo, talvez seja mais interessante passar a função para o callback, pois o reload pode ser chamado antes de 
 * finalizar o processo da função
 */
export function autoReload(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        //*Posso aplicar uma logica antes 

        //Executa a função original
        const result = originalMethod.apply(this, args);

        //*Ou depois
        if (typeof (this as any).reload == 'function') (this as any).reload();

        return result;
    }

    return descriptor;
}