export class Court {
    id?: string;
    name: string;
    type:string;
    road: string;
    neighborhood: string;
    city: string;
    number: string;
    reference?: string;
}

export class EditCourt {
    idCourt?: string;
    name?: string;
    road?: string;
    neighborhood?: string;
    city?: string;
    number?: string;
    reference?: string;
}
