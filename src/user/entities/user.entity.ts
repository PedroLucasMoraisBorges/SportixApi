export class User {
    id?: string;
    email: string;
    password1?: string;
    password2?: string;
    name: string;
    cpf: string;
    phoneNumber: string;
}

export class UserLogin {
    id: string;
    email: string;
    password: string
    name: string;
    cpf: string;
    phoneNumber: string;
    court: []
}

export class UserEdit {
    name?: string;
    cpf?: string;
    phoneNumber?: string;
}