import { IsNotEmpty } from "class-validator";
import { OperatingDayCreate } from "../entities/operatingDay.entity";

// const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// const hourOfDay = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

export class CreateOperatingDayBody implements OperatingDayCreate {
    @IsNotEmpty()
    days: string[]

    @IsNotEmpty()
    hours: string[];

    @IsNotEmpty()
    fk_court: string;
}