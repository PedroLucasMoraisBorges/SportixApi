export class EditUserBody implements UserEdit {
    @Length(15, 254)
    @IsOptional()
    @Matches(/^[\p{L}\s]+$/u, { message: "O nome deve conter apenas letras e espaços" })
    name?: string;

    @IsOptional()
    @Matches(/^\d+$/, { message: "O Cpf deve conter apenas números" })
    @Length(11, 11)
    cpf?: string;

    @IsOptional()
    @Matches(/^\d+$/, { message: "O telefone deve conter apenas números" })
    @Length(11, 11)
    phoneNumber?: string;
}