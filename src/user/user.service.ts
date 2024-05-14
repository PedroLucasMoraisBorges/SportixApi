import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt'
import { CreateUserBody } from './dtos/create-user-body';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }
  async create(object: CreateUserBody) {    

    const email = object.email

    if (object.password1 != object.password2) {
      throw new Error('As senhas não coincidem')
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Usuário com este email já cadastrado')
    }


    const passwordHash = await bcrypt.hash(object.password1, 10)

    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        name: object.name,
        cpf: object.cpf,
        email: object.email,
        password: passwordHash,
        phoneNumber : object.phoneNumber
      }
    })


    return user

  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
        where: { email }
    });
  }

  async getUserNames(): Promise<string[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => user.name);
  }
}