export function asyncTimeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export class DebounceTime {
    private timeout?: NodeJS.Timeout;

    constructor(private ms: number) { }

    exec(func: () => void) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(func, this.ms);
    }
}