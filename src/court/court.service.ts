import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import { CreateCourtBody } from './dtos/create-court-body';

@Injectable()
export class CourtService {

    constructor(private readonly prisma: PrismaService) { }
    async create(object: CreateCourtBody) {
  
      const court = await this.prisma.court.create({
        data: {
          id: randomUUID(),
          name: object.name,
          rua: object.rua,
          bairro: object.bairro,
          cidade: object.cidade,
          number : object.number,
          reference : object.reference,
        }
      })
  
      return {
        court,
      }
  
    }
}
