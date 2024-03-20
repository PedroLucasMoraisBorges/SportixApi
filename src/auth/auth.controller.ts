import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserBody } from "src/dtos/create-user-body";
import { LoginUserBody } from "src/dtos/login-user-body";
import { UserRepository } from "src/repositories/user-repository";

@Controller('acess')
export class AuthController{
    constructor(
        private userRepository : UserRepository
    ) {}

    @Post('login')
    async getUser(@Body() body : LoginUserBody){
        const {email} = body
        return await this.userRepository.login(email)
    }

    @Post('register')
    async createUser(@Body() body : CreateUserBody){
        const {name, cpf, email, phoneNumber} = body;

        await this.userRepository.create(name, cpf, email, phoneNumber)
    }
}
