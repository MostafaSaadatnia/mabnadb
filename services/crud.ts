import { Command } from "../models/command";
import { List } from "../types/list";

export class CrudService {
    dbs = {
        db1: {
            persons: [
                { id: '12uax-sadx', name: 'Mostafa', family: 'Saadatnia', age: 29 },
                { id: '13422uax-sa324dx', name: 'Firoozeh', family: 'Lotfi', age: 29 },
            ]
        }
    };

    constructor() { }

    index(): unknown {
        throw 'This method does not implementeds now!';
    }

    create(): unknown {
        throw 'This method does not implementeds now!';
    }

    store(): unknown {
        throw 'This method does not implementeds now!';
    }

    show(): unknown {
        throw 'This method does not implementeds now!';
    }

    edit(): unknown {
        throw 'This method does not implementeds now!';
    }

    update(): unknown {
        throw 'This method does not implementeds now!';
    }

    destroy(): unknown {
        throw 'This method does not implementeds now!';
    }

    query(query: string): List {
        return this.commandAdapter(query.trim());
    }


    private commandAdapter(query: string): List {
        let command;
        command = query.split(' ')[0];
        switch (command) {
            case Command.ALTER_DATABASE:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            case Command.ALTER_TABLE:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            case Command.CREATE_DATABASE:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            case Command.CREATE_INDEX:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            case Command.CREATE_TABLE:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            case Command.DROP_INDEX:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            case Command.DROP_TABLE:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            case Command.INSERT_INTO:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            case Command.SELECT:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            case Command.UPDATE:
                console.log(command);
                return this.select(query.split(Command.SELECT)[1].trim());

            default:
                throw Error('Query is not valid!');
        }
    }

    private select(query: string): List {
        let result: any[] = [];
        let columnsString = query.split('FROM')[0].trim();
        let columns: string[] = [];

        // Choose database
        const database: string = query
            .split('FROM')[1]
            .split('.')[0].trim();

        // Choose table
        const table: string = query
            .split('FROM')[1]
            .split('.')[1]
            .split(' ')[0].trim();

        if (columnsString.includes('*')) {
            columns.push('*');
            // Fill the result
            result = this.dbs[database][table];
        }
        else {
            columns = columnsString.split(',');
            // Trim Columns
            columns.forEach((column, index) => {
                columns[index] = column.trim();
            });
            // Fill the result
            this.dbs[database][table].forEach((element) => {
                let row = {};
                columns.forEach((column) => {
                    row[column] = element[column];
                });
                result.push(row);
            });
        }

        return result;
    }
}