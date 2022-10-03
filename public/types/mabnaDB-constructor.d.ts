import { MabnaDB } from "./mabnaDB";
import { Transaction } from "./transaction";
import { ThenShortcut } from "./then-shortcut";
import { TableSchema } from "./table-schema";
import { IndexSpec } from "./index-spec";
import { MabnaDBExceptionClasses, MabnaDBErrors } from "./errors";
import { PromiseExtendedConstructor } from "./promise-extended";
import { MabnaDBEventSet } from "./mabnaDB-event-set";
import { MabnaDBDOMDependencies } from "./mabnaDB-dom-dependencies";
import { GlobalMabnaDBEvents, ObservabilitySet } from "./db-events";
import { Observable } from "./observable";

export type ChromeTransactionDurability = 'default' | 'strict' | 'relaxed'

export interface MabnaDBOptions {
    addons?: Array<(db: MabnaDB) => void>,
    autoOpen?: boolean,
    indexedDB?: { open: Function },
    IDBKeyRange?: { bound: Function, lowerBound: Function, upperBound: Function },
    allowEmptyDB?: boolean,
    modifyChunkSize?: number,
    chromeTransactionDurability?: ChromeTransactionDurability
}

export interface MabnaDBConstructor extends MabnaDBExceptionClasses {
    new(databaseName: string, options?: MabnaDBOptions): MabnaDB;
    prototype: MabnaDB;

    addons: Array<(db: MabnaDB) => void>;
    version: number;
    semVer: string;
    currentTransaction: Transaction;
    waitFor<T>(promise: PromiseLike<T> | T, timeoutMilliseconds?: number): Promise<T>;

    getDatabaseNames(): Promise<string[]>;
    getDatabaseNames<R>(thenShortcut: ThenShortcut<string[], R>): Promise<R>;

    vip<U>(scopeFunction: () => U): U;
    ignoreTransaction<U>(fn: () => U): U;
    liveQuery<T>(fn: () => T | Promise<T>): Observable<T>;
    extendObservabilitySet(target: ObservabilitySet, newSet: ObservabilitySet): ObservabilitySet;
    override<F>(origFunc: F, overridedFactory: (fn: any) => any): F; // ?
    getByKeyPath(obj: Object, keyPath: string | string[]): any;
    setByKeyPath(obj: Object, keyPath: string | string[], value: any): void;
    delByKeyPath(obj: Object, keyPath: string | string[]): void;
    shallowClone<T>(obj: T): T;
    deepClone<T>(obj: T): T;
    asap(fn: Function): void; //?
    maxKey: Array<Array<void>> | string;
    minKey: number;
    exists(dbName: string): Promise<boolean>;
    delete(dbName: string): Promise<void>;
    dependencies: MabnaDBDOMDependencies;
    default: MabnaDB; // Work-around for different build tools handling default imports differently.

    Promise: PromiseExtendedConstructor;
    //TableSchema: {}; // Deprecate!
    //IndexSpec: {new():IndexSpec}; //? Deprecate
    Events: (ctx?: any) => MabnaDBEventSet;
    on: GlobalMabnaDBEvents;

    errnames: MabnaDBErrors;
}