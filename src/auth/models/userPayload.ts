import { Court } from "src/court/entities/court.entity";

export interface UserPayload {
    sub : string,
    email : string,
    name : string,
    court : Court[],
    ist? : number,
    exp? : number
};