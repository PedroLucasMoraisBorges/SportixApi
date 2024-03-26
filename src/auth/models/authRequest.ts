import { Request } from "express";
import { UserLogin } from "src/user/entities/user.entity";

export interface AuthRequest extends Request {
    user : UserLogin;
}