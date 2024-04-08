import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'crypto';
import { CreateCourtBody } from './dtos/create-court-body';
import { UserLogin } from 'src/user/entities/user.entity';
import { CreateOperatingDayBody } from './dtos/create-operatingDay-body';
import { TimeForUSer } from './entities/time.entity';

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
      }
    })

    return courts
  }

  private async getWekendDay(date) : Promise<string>{
    const partesData: string[] = date.split("-");
    const data: Date = new Date(parseInt(partesData[2]), parseInt(partesData[1]) - 1, parseInt(partesData[0]));

    const dayNames: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const diaSemana: number = data.getDay();

    return dayNames[diaSemana];
  }

  async getCourtInfo(id, date) {
    const nomeDiaSemana = await this.getWekendDay(date)

    const operatingDay = await this.prisma.operatingDay.findMany({
      where : {
        fk_court : id,
        day : nomeDiaSemana
      },
      include : {Times : true}
    })

    const returningTimes = []
    
    for(const time of operatingDay[0].Times){
      const reservation = await this.prisma.reservation.findMany({
        where : {
          hour : time.hour,
          fk_court : id,
          date : date
        }
      })
      
      const timeForUser : TimeForUSer = {
        id : time.id,
        hour : time.hour,
        status : "undefined"
      }

      if(reservation.length != 0) {
        timeForUser.status = "Reservado"
      }
      else{
        timeForUser.status = "Livre"
      }

      returningTimes.push(timeForUser)
    }

    return returningTimes
  }

  async createOperatingDays(object : CreateOperatingDayBody) {
    const { days, hours, fk_court } = object;
    const returnDays = []

    for(const dayInputed of days) {
      const existingDay = await this.prisma.operatingDay.findMany({
        where : {
          day: dayInputed,
          fk_court: fk_court
        }
      })

      if (existingDay.length == 0){
        const day = await this.prisma.operatingDay.create({
          data: {
            id : randomUUID(),
            day: dayInputed,
            court: {connect: {id: fk_court}}
          }
        })

        const returnHours = []

        for (const hourInputed of hours) {
          const existingHour = await this.prisma.time.findMany({
            where: {
              hour : hourInputed,
              fk_operating_day : day.id
            }
          }) 

          if (existingHour.length == 0) {
            const hour = await this.prisma.time.create({
              data: {
                id: randomUUID(),
                hour: hourInputed,
                operatingDay: {connect: {id: day.id}}
              }
            })

            returnHours.push(hour)
          }
        }
        returnDays.push({day, returnHours})
      }
    }

    return returnDays
  }


}
