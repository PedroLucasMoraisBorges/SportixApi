import { IsNotEmpty, IsString, Length } from "class-validator";
import { Time } from "../entities/time.entity";

export class CreateTimeBody implements Time {
    @IsNotEmpty()
    @IsString()
    @Length(5,5)
    hour: string;

    @IsNotEmpty()
    @IsString()
    fk_court: string;
}