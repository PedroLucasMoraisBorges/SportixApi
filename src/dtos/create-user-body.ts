import {IsNotEmpty, Length, IsEmail, Matches} from 'class-validator'

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
}