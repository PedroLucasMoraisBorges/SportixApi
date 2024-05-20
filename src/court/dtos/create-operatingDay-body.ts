import { IsNotEmpty } from "class-validator";
import { OperatingDayCreate } from "../entities/operatingDay.entity";

export class CreateOperatingDayBody implements OperatingDayCreate {
    @IsNotEmpty()
    days: string[]

    @IsNotEmpty()
    hours: string[];

    @IsNotEmpty()
    fk_court: string;
}