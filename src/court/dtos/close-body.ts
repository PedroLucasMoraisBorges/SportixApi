import { IsNotEmpty, IsString } from "class-validator"

export class CloseTimeBody {
    @IsNotEmpty()
    @IsString()
    hour : string

    @IsNotEmpty()
    @IsString()
    date : string

    @IsNotEmpty()
    @IsString()
    fk_court : string
}

export class CloseDayBody {
    @IsNotEmpty()
    @IsString()
    date : string

    @IsNotEmpty()
    @IsString()
    fk_court : string
}

export class CancelReservationBody {
    @IsNotEmpty()
    @IsString()
    idReservation : string
}