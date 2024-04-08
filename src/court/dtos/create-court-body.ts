import {IsNotEmpty, Length, Matches} from 'class-validator'
import { Court } from '../entities/court.entity';

export class CreateCourtBody implements Court{
    @Length(10, 254)
    @IsNotEmpty({
        message : "O campo de nome não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    name : string;

    @Length(5, 254)
    @IsNotEmpty({
        message : "O campo RUA não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    road : string;

    @Length(5, 254)
    @IsNotEmpty({
        message : "O campo BAIRRO não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    neighborhood : string;

    @Length(5, 254)
    @IsNotEmpty({
        message : "O campo CIDADE não pode estar vazio"
    })
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    city : string;

    @Length(1, 5)
    @IsNotEmpty({
        message : "O campo NÚMERO não pode estar vazio"
    })
    number : string;

    @Length(5, 254)
    reference : string;
}