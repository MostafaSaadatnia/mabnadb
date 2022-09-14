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

        const action = query.includes('SELECT');
        console.log(action);
        return [];
    }
}