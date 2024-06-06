import {IsNotEmpty, IsOptional, Length, Matches} from 'class-validator'
import { Court, EditCourt } from '../entities/court.entity';

export class CreateCourtBody implements Court{
    @IsNotEmpty({
        message : "O campo de nome não pode estar vazio"
    })
    @Length(10, 254)
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    name : string;

    @IsNotEmpty({
        message : "O campo RUA não pode estar vazio"
    })
    @Length(5, 254)
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    road : string;

    @IsNotEmpty({
        message : "O campo BAIRRO não pode estar vazio"
    })
    @Length(5, 254)
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    neighborhood : string;

    @IsNotEmpty({
        message : "O campo CIDADE não pode estar vazio"
    })
    @Length(5, 254)
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    city : string;

    @IsNotEmpty({
        message : "O campo NÚMERO não pode estar vazio"
    })
    @Length(1, 5)
    number : string;

    @IsNotEmpty({
        message : "O campo TIPO não pode estar vazio"
    })
    type:string;

    @IsOptional()
    @Length(5, 254)
    reference : string;
}


export class EditCourtBody implements EditCourt {
    @IsNotEmpty()
    idCourt?: string;

    @IsOptional()
    name?: string;

    @IsOptional()
    road?: string;

    @IsOptional()
    neighborhood?: string;

    @IsOptional()
    city?: string;

    @IsOptional()
    number?: string;

    @IsOptional()
    reference?: string;
}
