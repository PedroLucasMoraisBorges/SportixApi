import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class SelectRecurrenceRangeBody {
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