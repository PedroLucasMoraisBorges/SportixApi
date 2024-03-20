import { PrismaService } from "src/database/prisma.service";
import { UserRepository } from "../user-repository";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaService) {}

    

    async create(name: string, cpf: string, email: string, phoneNumber: string): Promise<void> {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Usuário com este email já cadastrado');
        }

        await this.prisma.user.create({
            data: {
                id: randomUUID(),
                name,
                cpf,
                email,
                phoneNumber
            }
        }
        )
    }

    async login(email:string) : Promise<{ id: string; name: string; cpf: string; phoneNumber: string; email: string; } | null>{
        const user = await this.prisma.user.findUnique({
            where : {
                email : email
            }
        })

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        console.log(user)

        return user
    }
}