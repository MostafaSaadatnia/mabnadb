import Table from "./table";

export default class DataBase {
    public name: string = "db_MabnaDB";
    public table: Table[];

    constructor(name: string) {
        this.name = `db_${name}`;
        localStorage.setItem(`${this.name}`, JSON.stringify({ type: 'Database', name: this.name, tables: [] }));
    }

    createTable(tableName: string): void {
        this.table.push(new Table(tableName, this));
    }
}
