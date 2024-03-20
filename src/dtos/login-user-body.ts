import {IsNotEmpty, Length} from 'class-validator'

export class LoginUserBody {
    @Length(13, 254)
    @IsNotEmpty()
    email : string;
}