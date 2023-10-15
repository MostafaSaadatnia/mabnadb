import { LinqBuilder } from "../types/linq.mode";

export class List<T> implements LinqBuilder {
    private data: T[];

    constructor(data: T[]) {
        this.data = data;
    }

    firstOrDefault(predicate: any): any {
        var result = this.data.filter(predicate);
        return result ? result[0] : undefined;
    }

    where(predicate: any): any {
        return this.data.filter(predicate);
    }

    public static TResult Aggregate<TSource,TAccumulate,TResult> (this System.Collections.Generic.IEnumerable<TSource> source, TAccumulate seed, Func<TAccumulate,TSource,TAccumulate> func, Func<TAccumulate,TResult> resultSelector);
}

interface Array<T> {
    aggregate<U>(accumulator: (acc: U, item: T) => U, initialValue: U): U;
  }
  
  Array.prototype.aggregate = function<T, U>(accumulator: (acc: U, item: T) => U, initialValue: U): U {
    var result = initialValue;
    for (var i = 0; i < this.length; i++) {
      result = accumulator(result, this[i]);
    }
    return result;
  };