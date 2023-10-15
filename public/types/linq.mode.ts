export interface LinqBuilder {
    FirstOrDefault(predicate: any): any;
    Where(predicate: any): any;
}