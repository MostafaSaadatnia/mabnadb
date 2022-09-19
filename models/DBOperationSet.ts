import { DBOperation, DBOperationPrimaryKey } from "./DBOperation.js";

export type DBOperationsSet<PK = DBOperationPrimaryKey> = Array<{ table: string; muts: DBOperation<PK>[] }>;