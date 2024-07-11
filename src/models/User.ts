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

    constructor(id: string, name: string, surname: string, role: Role) {
        this._id = id;
        this.name = name;
        this.surname = surname;
        this.role = role;
    }
}

export { Role}