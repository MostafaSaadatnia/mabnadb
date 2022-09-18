import DataBase from "./database";

export default class Table {
    public name: string = "Table_1";

    constructor(name: string, database: DataBase) {
        this.name = `tbl_${name}`;
        let selectedDatabase = JSON.parse(localStorage.getItem(database.name) || `{}`);
        if (!!selectedDatabase) {
            selectedDatabase.tables.push({ type: 'table', name: this.name });
            localStorage.setItem(`${this.name}`, JSON.stringify(selectedDatabase));
        }
    }
}
