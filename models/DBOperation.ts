export type DBOperationPrimaryKey = string | (string | number)[];

const enum DBCoreRangeType {
    Equal = 1,
    Range = 2,
    Any = 3,
    Never = 4
}

/** This interface must be identical to the interface with same name in mabnaDB.
 * If DBCore ever gets moved out from mabnaDB we could let it be referenced.
 * We could also be dependent on mabnaDB but it would be a pitty just for this reason.
*/
interface DBCoreKeyRange {
    readonly type: DBCoreRangeType | number;
    readonly lower: any;
    readonly lowerOpen?: boolean;
    readonly upper: any;
    readonly upperOpen?: boolean;
}

export type DBOperation<PK = DBOperationPrimaryKey> =
    | DBInsertOperation<PK>
    | DBUpsertOperation<PK>
    | DBUpdateOperation<PK>
    | DBModifyOperation<PK>
    | DBDeleteOperation<PK>;

export interface DBOperationCommon<PK = DBOperationPrimaryKey> {
    rev?: number;
    ts?: number | null; // timestamp
    keys: PK[]; // Needed also in delete and update operations when criteria is specificied: for server->client rollback operation
    txid?: string | null;
    userId?: string | null;
}
export interface DBInsertOperation<PK = DBOperationPrimaryKey> extends DBOperationCommon<PK> {
    type: "insert";
    values: readonly any[];
}

export interface DBUpsertOperation<PK = DBOperationPrimaryKey> extends DBOperationCommon<PK> {
    type: "upsert";
    values: readonly any[];
}

export interface DBUpdateOperation<PK = DBOperationPrimaryKey> extends DBOperationCommon<PK> {
    type: "update";
    changeSpecs: { [keyPath: string]: any }[];
}

export interface DBModifyOperation<PK = DBOperationPrimaryKey> extends DBOperationCommon<PK> {
    type: "modify";
    criteria: {
        index: string | null;
        range: DBCoreKeyRange;
    },
    changeSpec: { [keyPath: string]: any };
}


export interface DBDeleteOperation<PK = DBOperationPrimaryKey> extends DBOperationCommon<PK> {
    type: "delete";
    criteria?:
    | {
        index: string | null;
        range: DBCoreKeyRange;
    }
    | false;
}