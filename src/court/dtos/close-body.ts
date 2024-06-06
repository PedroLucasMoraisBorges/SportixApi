import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { CloseTime } from "../entities/time.entity"

export class CloseTimeBody implements CloseTime {
    @IsNotEmpty()
    @IsString()
    hours: string[]

    @IsNotEmpty()
    @IsString()
    date: string

    @IsNotEmpty()
    @IsString()
    fk_court: string
}

export class CloseDayBody {
    @IsNotEmpty()
    @IsString()
    date: string

    @IsNotEmpty()
    @IsString()
    fk_court: string
}

export class CancelReservationBody {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    type_reserve: string

    @IsOptional()
    @IsString()
    date: string
}