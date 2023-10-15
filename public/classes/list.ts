import { LinqBuilder } from "../types/linq.mode";

export class List<T> implements LinqBuilder {
    private data: T[];

    constructor(data: T[]) {
        this.data = data;
    }

    FirstOrDefault(predicate: any): any {
        var result = this.data.filter(predicate);
        return result ? result[0] : undefined;
    }

    Where(predicate: any): any {
        return this.data.filter(predicate);
    }
}