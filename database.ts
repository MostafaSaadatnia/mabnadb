export default class DataBase {
    public name: string = "MabnaDB";

    constructor(name: string) {
        this.name = `db_${name}`;
        localStorage.setItem(`${this.name}`, JSON.stringify({ type: 'Database', name: this.name, tables: [] }));
    }
}
