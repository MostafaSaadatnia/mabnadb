import { IndexableTypeArrayReadonly } from "./indexable-type";

/** MabnaDBError
 * 
 * Common base class for all errors originating from MabnaDB.js except TypeError,
 * SyntaxError and RangeError.
 * 
 * https://mabnadb.com/docs/MabnaDBErrors/MabnaDBError
 * 
 */
export interface MabnaDBError extends Error {
    name: string;
    message: string;
    stack: string;
    inner: any;
    toString(): string;
}

/**
 * List of the names of auto-generated error classes that extends MabnaDBError
 * and shares the interface of MabnaDBError.
 * 
 * Each error should be documented at https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.<errname>
 * 
 * The generic type MabnaDBExceptionClasses is a map of full error name to
 * error constructor. The MabnaDBExceptionClasses is mixed in into MabnaDB,
 * so that it is always possible to throw or catch certain errors via
 * MabnaDB.ErrorName. Example:
 * 
 * try {
 *   throw new MabnaDB.InvalidTableError("Invalid table foo", innerError?);
 * } catch (err) {
 *   if (err instanceof MabnaDB.InvalidTableError) {
 *     // Could also have check for err.name === "InvalidTableError", or
 *     // err.name === MabnaDB.errnames.InvalidTableError.
 *     console.log("Seems to be an invalid table here...");
 *   } else {
 *     throw err;
 *   }
 * }
 */
export type MabnaDBErrors = {
    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.OpenFailedError
    OpenFailed: 'OpenFailedError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.VersionChangeError
    VersionChange: 'VersionChangeError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.SchemaError
    Schema: 'SchemaError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.UpgradeError
    Upgrade: 'UpgradeError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.InvalidTableError
    InvalidTable: 'InvalidTableError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.MissingAPIError
    MissingAPI: 'MissingAPIError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.NoSuchDatabaseError
    NoSuchDatabase: 'NoSuchDatabaseError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.InvalidArgumentError
    InvalidArgument: 'InvalidArgumentError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.SubTransactionError
    SubTransaction: 'SubTransactionError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.UnsupportedError
    Unsupported: 'UnsupportedError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.InternalError
    Internal: 'InternalError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.DatabaseClosedError
    DatabaseClosed: 'DatabaseClosedError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.PrematureCommitError
    PrematureCommit: 'PrematureCommitError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.ForeignAwaitError
    ForeignAwait: 'ForeignAwaitError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.UnknownError
    Unknown: 'UnknownError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.ConstraintError
    Constraint: 'ConstraintError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.DataError
    Data: 'DataError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.TransactionInactiveError
    TransactionInactive: 'TransactionInactiveError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.ReadOnlyError
    ReadOnly: 'ReadOnlyError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.VersionError
    Version: 'VersionError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.NotFoundError
    NotFound: 'NotFoundError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.InvalidStateError
    InvalidState: 'InvalidStateError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.InvalidAccessError
    InvalidAccess: 'InvalidAccessError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.AbortError
    Abort: 'AbortError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.TimeoutError
    Timeout: 'TimeoutError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.QuotaExceededError
    QuotaExceeded: 'QuotaExceededError',

    // https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.DataCloneError
    DataClone: 'DataCloneError'
}

/** ModifyError
 * 
 * https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.ModifyError
 */
export interface ModifyError extends MabnaDBError {
    failures: Array<any>;
    failedKeys: IndexableTypeArrayReadonly;
    successCount: number;
}

/** BulkError
 * 
 * https://mabnadb.com/docs/MabnaDBErrors/MabnaDB.BulkError
 */
export interface BulkError extends MabnaDBError {
    failures: Error[];
    failuresByPos: { [operationNumber: number]: Error };
}

export interface MabnaDBErrorConstructor {
    new(msg?: string, inner?: Object): MabnaDBError;
    new(inner: Object): MabnaDBError;
    prototype: MabnaDBError;
}

export interface ModifyErrorConstructor {
    new(
        msg?: string,
        failures?: any[],
        successCount?: number,
        failedKeys?: IndexableTypeArrayReadonly): ModifyError;
    prototype: ModifyError;
}

export interface BulkErrorConstructor {
    new(msg?: string, failures?: { [operationNumber: number]: Error }): BulkError;
    prototype: BulkError;
}

export type ExceptionAliasSet = { [ShortName in keyof MabnaDBErrors]: MabnaDBErrorConstructor } & {
    MabnaDB: MabnaDBErrorConstructor,
    Modify: ModifyErrorConstructor;
    Bulk: BulkErrorConstructor;
}

export type ExceptionSet = { [P in MabnaDBErrors[keyof MabnaDBErrors]]: MabnaDBErrorConstructor };

export type MabnaDBExceptionClasses = ExceptionSet & {
    MabnaDBError: MabnaDBErrorConstructor,
    ModifyError: ModifyErrorConstructor;
    BulkError: BulkErrorConstructor;
}