import { IsNotEmpty, IsString } from "class-validator";
import { ReserveTime } from "../entities/time.entity";

export class ReserveTimeBody implements ReserveTime{
    @IsNotEmpty()
    @IsString()
    fk_court: string;

    @IsNotEmpty()
    @IsString()
    date: string;

    @IsNotEmpty()
    @IsString()
    hours: string[];
}