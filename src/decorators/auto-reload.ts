/**
* Decorator created for the SuperFabric class
 * Whenever the function is called it will re-render the editor, facilitating development
 * Note: apparently when it is a longer process, it may be more interesting to pass the function to the callback, as the reload can be called before
 * finalize the function process
 * 
 */
export function autoReload(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const result = originalMethod.apply(this, args);
        if (typeof (this as any).reload == 'function') (this as any).reload();
        return result;
    }

    return descriptor;
}