export interface LinqBuilder {
    firstOrDefault(predicate: any): any;
    where(predicate: any): any;
    aggregate<U>(accumulator: (acc: U, item: T) => U, initialValue: U): U;
}