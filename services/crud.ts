import { Command } from "../models/command";
import { List } from "../types/list";

export class CrudService {

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

    query(): List {
        let query = `SELECT name, family FROM db1.persons`;
        query = query.trim();
        const dbs = {
            db1: {
                persons: [
                    { id: '12uax-sadx', name: 'Mostafa', family: 'Saadatnia', age: 29 },
                    { id: '13422uax-sa324dx', name: 'Firoozeh', family: 'Lotfi', age: 29 },
                ]
            }
        };

        return this.commandAdapter(query);
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
        let propertiesString = query.split('FROM')[0].trim();
        let properties: string[] = [];
        if (propertiesString.includes('*')) {
            properties.push('*');
        } else {
            properties = propertiesString.split(',');
        }

        return [];
    }
}