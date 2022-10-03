import { Table } from './table';
import { Version } from './version';
import { DbEvents } from './db-events';
import { TransactionMode } from './transaction-mode';
import { Transaction } from './transaction';
import { WhereClause } from './where-clause';
import { Collection } from './collection';
import { DbSchema } from './db-schema';
import { TableSchema } from './table-schema';
import { MabnaDBConstructor } from './mabnaDB-constructor';
import { PromiseExtended } from './promise-extended';
import { IndexableType } from './indexable-type';
import { DBCore } from './dbcore';
import { Middleware, MabnaDBStacks } from './middleware';

export type TableProp<DX extends MabnaDB> = {
    [K in keyof DX]: DX[K] extends { schema: any, get: any, put: any, add: any, where: any } ? K : never;
}[keyof DX] & string;

type TXWithTables<DX extends MabnaDB> = MabnaDB extends DX
    ? Transaction // If not subclassed, just expect a Transaction without table props
    : Transaction & { [P in TableProp<DX>]: DX[P] };


export interface MabnaDB {
    readonly name: string;
    readonly tables: Table[];
    readonly verno: number;
    readonly vip: MabnaDB;

    readonly _allTables: { [name: string]: Table<any, IndexableType> };

    readonly core: DBCore;

    _createTransaction: (
        this: MabnaDB,
        mode: IDBTransactionMode,
        storeNames: ArrayLike<string>,
        dbschema: DbSchema,
        parentTransaction?: Transaction | null
    ) => Transaction;

    readonly _novip: MabnaDB;

    _dbSchema: DbSchema;

    version(versionNumber: number): Version;

    on: DbEvents;

    open(): PromiseExtended<MabnaDB>;

    table<T = any, TKey = IndexableType>(tableName: string): Table<T, TKey>;

    transaction<U>(
        mode: TransactionMode,
        tables: readonly (string | Table)[],
        scope: (
            trans: TXWithTables<this>
        ) => PromiseLike<U> | U
    ): PromiseExtended<U>;

    transaction<U>(
        mode: TransactionMode,
        table: string | Table,
        scope: (trans: TXWithTables<this>) => PromiseLike<U> | U
    ): PromiseExtended<U>;
    transaction<U>(
        mode: TransactionMode,
        table: string | Table,
        table2: string | Table,
        scope: (trans: TXWithTables<this>) => PromiseLike<U> | U
    ): PromiseExtended<U>;
    transaction<U>(
        mode: TransactionMode,
        table: string | Table,
        table2: string | Table,
        table3: string | Table,
        scope: (trans: TXWithTables<this>) => PromiseLike<U> | U
    ): PromiseExtended<U>;
    transaction<U>(
        mode: TransactionMode,
        table: string | Table,
        table2: string | Table,
        table3: string | Table,
        table4: string | Table,
        scope: (trans: TXWithTables<this>) => PromiseLike<U> | U
    ): PromiseExtended<U>;
    transaction<U>(
        mode: TransactionMode,
        table: string | Table,
        table2: string | Table,
        table3: string | Table,
        table5: string | Table,
        scope: (trans: TXWithTables<this>) => PromiseLike<U> | U
    ): PromiseExtended<U>;

    close(): void;

    delete(): PromiseExtended<void>;

    isOpen(): boolean;

    hasBeenClosed(): boolean;

    hasFailed(): boolean;

    dynamicallyOpened(): boolean;

    backendDB(): IDBDatabase;

    use(middleware: Middleware<DBCore>): this;
    // Add more supported stacks here... : use(middleware: Middleware<HookStack>): this;
    unuse({ stack, create }: Middleware<{ stack: keyof MabnaDBStacks }>): this;
    unuse({ stack, name }: { stack: keyof MabnaDBStacks; name: string }): this;

    // Make it possible to touch physical class constructors where they reside - as properties on db instance.
    // For example, checking if (x instanceof db.Table). Can't do (x instanceof MabnaDB.Table because it's just a virtual interface)
    Table: { prototype: Table };
    WhereClause: { prototype: WhereClause };
    Version: { prototype: Version };
    Transaction: { prototype: Transaction };
    Collection: { prototype: Collection };
}