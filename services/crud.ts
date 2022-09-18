import { Command } from "../models/command";
import QueryResponse from "../models/queryResponse";
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

    query(query: string): QueryResponse {
        let command;
        command = query.trim().split(' ')[0];

        switch (command) {
            case Command.ALTER_DATABASE:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

            case Command.ALTER_TABLE:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

            case Command.CREATE_DATABASE:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

            case Command.CREATE_INDEX:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

            case Command.CREATE_TABLE:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

            case Command.DROP_INDEX:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

            case Command.DROP_TABLE:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

            case Command.INSERT_INTO:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

            case Command.SELECT:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

            case Command.UPDATE:
                return { data: this.select(query.split(Command.SELECT)[1].trim()), message: 'This is a selected list from the database!' };

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