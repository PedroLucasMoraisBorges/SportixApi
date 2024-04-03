export class OperatingDay {
    id?: string
    day: string
    fk_court: string
}


export class OperatingDayCreate {
    days: string[]
    hours: string[]
    fk_court: string
}