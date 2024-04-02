import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import { CreateCourtBody } from './dtos/create-court-body';
import { UserLogin } from 'src/user/entities/user.entity';
import { CreateTimeBody } from './dtos/create-time-body';

@Injectable()
export class CourtService {

  constructor(private readonly prisma: PrismaService) { }
  async create(object: CreateCourtBody, user) {

    const court = await this.prisma.court.create({
      data: {
        id: randomUUID(),
        name: object.name,
        road: object.road,
        neighborhood: object.neighborhood,
        city: object.city,
        number: object.number,
        reference: object.reference,
        user: { connect: { id: user.id } }
      }
    })

    return {
      court,
    }

  }
  async getUserCourts(user : UserLogin) {
    const courts = await this.prisma.court.findMany({
      where: {
        fk_user: user.id
      },
      include: {
        Times: true
      }
    })

    return courts
  }

  async createTimes(object : CreateTimeBody) {
    const inputedHour = object.hour
    const courtId = object.fk_court

    const existingTime = await this.prisma.times.findMany({
      where: {
        fk_court : courtId,
        hour : inputedHour
      }
    })

    if (existingTime.length > 0) {
      throw new Error("Já existe esse horário para essa quadra")
    }

    const time = await this.prisma.times.create({
      data: {
        id : randomUUID(),
        hour : inputedHour,
        court : {connect: {id: courtId}}
      }
    })

    return time

  }
}
