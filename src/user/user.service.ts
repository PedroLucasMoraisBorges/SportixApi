import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt'
import { CreateUserBody } from './dtos/create-user-body';
import { UserEdit, UserLogin } from './entities/user.entity';
import { EditUserBody } from './dtos/edit-user-body';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }
<<<<<<< Updated upstream
  async create(object: CreateUserBody) {    
=======
  async create(object: CreateUserBody) {
>>>>>>> Stashed changes

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
        phoneNumber: object.phoneNumber
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
<<<<<<< Updated upstream
=======

  async getUserInfo(user: UserLogin) {
    const userInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      cpf: user.cpf,
      phoneNumber: user.phoneNumber,
      court: user.court
    };
    return userInfo;
  }

  async editUser(editUserBody : EditUserBody, user : UserLogin) {
    const {name, cpf, phoneNumber} = editUserBody

    const data : UserEdit = {};

    if (name !== undefined && name !== null) data.name = name;
    if (cpf !== undefined && cpf !== null) data.cpf = cpf;
    if (phoneNumber !== undefined && phoneNumber !== null) data.phoneNumber = phoneNumber;

    const updatedUser = await this.prisma.court.update({
      where: {
        id: user.id
      },
      data: data
    });

    return updatedUser;
  }
>>>>>>> Stashed changes
}