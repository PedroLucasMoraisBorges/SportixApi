export class Time{
    id? : string
    hour: string
    fk_court: string
}

export class TimeForUSer{
    id : string
    hour : string
    status : string
}

export class ReserveTime{
    fk_court : string
    date : string
    hour : string
}