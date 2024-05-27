import { IsArray, IsNotEmpty, IsString } from "class-validator"
import { ReleaseDay, ReleaseTime } from "../entities/release.entity"

export class ReleaseTimebody implements ReleaseTime {
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

export class ReleaseDayBody implements ReleaseDay {
    @IsNotEmpty()
    @IsString()
    fk_court: string

    @IsNotEmpty()
    @IsArray()
    dates: string[]
}