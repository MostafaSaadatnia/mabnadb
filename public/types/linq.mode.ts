export interface Query {
    firstOrDefault(predicate: any): Query;
    where(predicate: any): Query;
    select(selector: any): Query;
    orderBy(comparer: any): Query;
    skip(n): Query;
    take(n): Query;
    toArray(): any[];
}

export class Query implements Query {
    private data;
    constructor(data) {
        this.data = data;
    }

    firstOrDefault(predicate) {
        return new Query(this.data.filter(predicate).toArray().lenght > 0 ? this.data.filter(predicate) : this.data);
    }

    where(predicate) {
        return new Query(this.data.filter(predicate));
    }

    select(selector) {
        return new Query(this.data.map(selector));
    }

    orderBy(comparer) {
        return new Query(this.data.slice().sort(comparer));
    }

    skip(n) {
        return new Query(this.data.slice(n));
    }

    take(n) {
        return new Query(this.data.slice(0, n));
    }

    toArray(): any[] {
        return this.data.slice();
    }
}