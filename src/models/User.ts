enum Role {
    Admin = 'admin',
    DevOPS = 'devops',
    Developer = 'developer',
}

export default class User {
    _id: string;
    name: string;
    surname: string;
    role: Role;
    login: string;

    constructor(id: string, name: string, surname: string, role: Role, login: string) {
        this._id = id;
        this.name = name;
        this.surname = surname;
        this.role = role;
        this.login = login;
    }
}

export { Role}