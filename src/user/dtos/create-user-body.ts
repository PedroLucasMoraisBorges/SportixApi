import {IsNotEmpty, Length, IsEmail, Matches, IsString} from 'class-validator'

export class CreateUserBody {
    @Length(15, 254)
    @IsNotEmpty({
        message : "O campo de nome não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    name : string;

    @Matches(/^\d+$/, { message: "O Cpf deve conter apenas números" })
    @Length(11, 11)
    @IsNotEmpty()
    cpf : string;

    @IsEmail({}, {
        message: "O campo de e-mail deve ser um endereço de e-mail válido"
    })
    @Length(10, 254)
    @IsNotEmpty()
    email : string;

    @Matches(/^\d+$/, { message: "O telefone deve conter apenas números" })
    @Length(11, 11)
    @IsNotEmpty()
    phoneNumber : string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password1: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password2: string;
}