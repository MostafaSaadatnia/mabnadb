import { MabnaDBEventSet } from "./mabnaDB-event-set";
import { MabnaDBEvent } from "./mabnaDB-event";
import { Transaction } from "./transaction";
import { MabnaDB } from "./mabnaDB";
import { IntervalTree } from "./rangeset";

export interface MabnaDBOnReadyEvent {
    subscribe(fn: (vipDb: MabnaDB) => any, bSticky: boolean): void;
    unsubscribe(fn: (vipDb: MabnaDB) => any): void;
    fire(vipDb: MabnaDB): any;
}

export interface MabnaDBVersionChangeEvent {
    subscribe(fn: (event: IDBVersionChangeEvent) => any): void;
    unsubscribe(fn: (event: IDBVersionChangeEvent) => any): void;
    fire(event: IDBVersionChangeEvent): any;
}

export interface MabnaDBPopulateEvent {
    subscribe(fn: (trans: Transaction) => any): void;
    unsubscribe(fn: (trans: Transaction) => any): void;
    fire(trans: Transaction): any;
}

export interface MabnaDBCloseEvent {
    subscribe(fn: (event: Event) => any): void;
    unsubscribe(fn: (event: Event) => any): void;
    fire(event: Event): any;
}

export interface DbEvents extends MabnaDBEventSet {
    (eventName: 'ready', subscriber: (vipDb: MabnaDB) => any, bSticky?: boolean): void;
    (eventName: 'populate', subscriber: (trans: Transaction) => any): void;
    (eventName: 'blocked', subscriber: (event: IDBVersionChangeEvent) => any): void;
    (eventName: 'versionchange', subscriber: (event: IDBVersionChangeEvent) => any): void;
    (eventName: 'close', subscriber: (event: Event) => any): void;
    ready: MabnaDBOnReadyEvent;
    populate: MabnaDBPopulateEvent;
    blocked: MabnaDBEvent;
    versionchange: MabnaDBVersionChangeEvent;
    close: MabnaDBCloseEvent;
}

export type ObservabilitySet = {
    // `idb:${dbName}/${tableName}/changedRowContents` - keys.
    // `idb:${dbName}/${tableName}/changedIndexes/${indexName}` - indexes
    [part: string]: IntervalTree;
};

export interface MabnaDBOnStorageMutatedEvent {
    subscribe(fn: (parts: ObservabilitySet) => any): void;
    unsubscribe(fn: (parts: ObservabilitySet) => any): void;
    fire(parts: ObservabilitySet): any;
}

export interface GlobalMabnaDBEvents extends MabnaDBEventSet {
    (eventName: 'storagemutated', subscriber: (parts: ObservabilitySet) => any): void;
    storagemutated: MabnaDBOnStorageMutatedEvent;
}