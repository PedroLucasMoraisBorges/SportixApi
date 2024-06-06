import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class CourtUtilits {
    constructor(private readonly prisma: PrismaService) { }

    async verifyIsToday(date) {
        const partesData: string[] = date.split("-");
        const currentDay: Date = new Date(parseInt(partesData[2]), parseInt(partesData[1]) - 1, parseInt(partesData[0]));
        const today = new Date()
        today.setHours(0, 0, 0, 0);

        console.log(currentDay)
        console.log(today)


        if (currentDay >= today) {
            return true
        }
        else{
            return false
        }
    }

    async getDates(startDate: string, jump: number, endDate: Date) {
        const currentDate = new Date(endDate);
        const dates: Date[] = [];
    
        let currentDateJump = new Date(startDate);
    
        // Adicione datas anteriores à start_date, se necessário
        while (currentDateJump > currentDate) {
            dates.push(new Date(currentDateJump)); // Adiciona a data atual
    
            currentDateJump = new Date(currentDateJump); // Cria uma nova instância para evitar problemas de referência
            currentDateJump.setUTCDate(currentDateJump.getUTCDate() - jump); // Subtrai o salto de dias
        }
    
        // Adicione datas posteriores à start_date até a endDate
        while (currentDateJump <= currentDate) {
            dates.push(new Date(currentDateJump)); // Adiciona a data atual
    
            currentDateJump = new Date(currentDateJump); // Cria uma nova instância para evitar problemas de referência
            currentDateJump.setUTCDate(currentDateJump.getUTCDate() + jump); // Adiciona o salto de dias
        }
        
    
        return dates;
    }
    
    async validateRecurrenceUser(date: string, recurrenceUser) {
        const currentDate = this.formateDateRequest(date);
        const start_date = this.formateDateRequest(recurrenceUser.start_date);

        const dates = await this.getDates(start_date, recurrenceUser.range_days, new Date());
    
        return dates.some(date => {
            const formattedDate = this.formatDate(date);
            return formattedDate === currentDate;
        });
    }



    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
        const day = (date.getDate() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário

        return `${year}-${month}-${day}`;
    }


    async getWekendDay(date): Promise<string> {
        const partesData: string[] = date.split("-");
        const data: Date = new Date(parseInt(partesData[2]), parseInt(partesData[1]) - 1, parseInt(partesData[0]));


        const dayNames: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const diaSemana: number = data.getDay();

        return dayNames[diaSemana];
    }

    async getCurrentDateFormatted() {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // +1 porque os meses começam do zero
        const year = currentDate.getFullYear();
    
        return `${day}-${month}-${year}`;
    }

    async getTimesOfDay(date, fk_court) {
        const nomeDiaSemana = await this.getWekendDay(date)

        const operatingDay = await this.prisma.operatingDay.findFirst({
            where: {
                fk_court: fk_court,
                day: nomeDiaSemana
            },
            include: { Times: true }
        })

        const times = operatingDay.Times.map(time => time.hour);
        return times;
    }

    async closureFindMany(fk_court, date, hour) {
        const closures = await this.prisma.closure.findMany({
            where: {
                hour: hour,
                fk_court: fk_court,
                date: date
            }
        })

        return closures
    }

    async reservationFindMany(fk_court, date, hour, status) {
        const reservations = await this.prisma.reservation.findMany({
            where: {
                hour: hour,
                fk_court: fk_court,
                date: date,
                status: status
            }
        })

        return reservations
    }

    async reservationDayFindMany(date, fk_court, status) {
        const reservations = await this.prisma.reservation.findMany({
            where: {
                fk_court: fk_court,
                date: date,
                status: status
            }
        })

        return reservations
    }

    async freeGameFindMany(fk_court, date, hour) {
        const freeGames = await this.prisma.freeGame.findMany({
            where: {
                fk_court: fk_court,
                date: date,
                hour: hour
            }
        })

        return freeGames
    }

    formateDateRequest(date: string) {
        const data = date;
        const partes = data.split("-"); // Divide a string usando o caractere "-"

        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
}