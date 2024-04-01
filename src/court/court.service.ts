import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import { CreateCourtBody } from './dtos/create-court-body';

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
  async getUserCourts(user) {
    const courts = this.prisma.court.findMany({
      where: {
        fk_user: user.id
      },
      include: {
        Times: true
      }
    })

    return courts
  }
}
