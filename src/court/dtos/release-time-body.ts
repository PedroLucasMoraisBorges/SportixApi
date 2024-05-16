import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class ReleaseTimebody {
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

export class ReleaseDayBody {
    @IsNotEmpty()
    @IsString()
    fk_court: string

    @IsNotEmpty()
    @IsArray()
    dates: string[]
}