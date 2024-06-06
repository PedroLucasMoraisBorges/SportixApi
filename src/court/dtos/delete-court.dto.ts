import { IsNotEmpty } from "class-validator";

export class DeleteCourtBody {
    @IsNotEmpty()
    id_court : string
}