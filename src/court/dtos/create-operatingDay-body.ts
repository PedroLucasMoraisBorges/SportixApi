import { IsIn, IsNotEmpty, Length } from "class-validator";
import { OperatingDay } from "../entities/operatingDay.entity";

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class CreateOperatingDayBody implements OperatingDay {
    @IsNotEmpty()
    @IsIn(daysOfWeek)
    @Length(5,9)
    day: string

    @IsNotEmpty()
    fk_court: string;
}