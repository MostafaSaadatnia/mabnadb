import DataBase from "./database";

export default class MabnaDB {
    public dbVersion: number = 1;
    public database: DataBase;
    constructor() { }

    createDataBase(databaseName: string): void {
        this.database = new DataBase(databaseName);
    }
}
