import {IsNotEmpty, Length, Matches} from 'class-validator'

export class CreateCourtBody {
    @Length(15, 254)
    @IsNotEmpty({
        message : "O campo de nome não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    name : string;

    @Length(15, 254)
    @IsNotEmpty({
        message : "O campo RUA não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    rua : string;

    @Length(15, 254)
    @IsNotEmpty({
        message : "O campo BAIRRO não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    bairro : string;

    @Length(15, 254)
    @IsNotEmpty({
        message : "O campo CIDADE não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    cidade : string;

    @Length(15, 254)
    @IsNotEmpty({
        message : "O campo NÚMERO não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    number : string;

    @Length(15, 254)
    reference : string;
}