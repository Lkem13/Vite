export default class User {
    id: string;
    name: string;
    surname: string;

    constructor(id: string, name: string, surname: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }
}