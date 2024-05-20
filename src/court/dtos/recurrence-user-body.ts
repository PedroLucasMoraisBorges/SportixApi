import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { RecurrenceUser } from "../entities/recurrenceUser.entity"

export class SelectRecurrenceRangeBody implements RecurrenceUser {
    @IsNotEmpty()
    @IsString()
    fk_court: string

    @IsNotEmpty()
    @IsString()
    hour: string

    @IsNotEmpty()
    @IsString()
    day: string

    @IsNotEmpty()
    @IsNumber()
    range_days: number
}