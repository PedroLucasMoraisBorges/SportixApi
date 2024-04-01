import { Court } from "src/court/entities/court.entity";

export interface UserFromJwt {
    id: string;
    email: string;
    name: string;
    court: Court[];
  }