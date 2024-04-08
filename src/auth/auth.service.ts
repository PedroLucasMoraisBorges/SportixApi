import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt'
import { User } from "@prisma/client";
import { UserToken } from "./models/userToken";
import { UserPayload } from "./models/userPayload";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly userService : UserService, private readonly jwtService : JwtService) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (isPasswordValid) {
                return {
                    ...user,
                    password: undefined,
                }
            }
        }

        throw new Error('Email address or password provided is incorrect')
    }

    login(user: User) : UserToken {
        // Transforma o User em JWT
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            court : []
        };

        const jwtToken = this.jwtService.sign(payload)
        console.log(jwtToken)

        return {
            access_token: jwtToken
        }
    }
}