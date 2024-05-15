import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class CourtUtilits {
    constructor(private readonly prisma: PrismaService) { }

    async getDates(startDate: string, jump: number, endDate) {
        const currentDate = new Date(endDate);
        const dates: Date[] = [];

        let currentDateJump = new Date(startDate);

        while (currentDateJump <= currentDate) {
            dates.push(new Date(currentDateJump)); // Adiciona a data atual

            currentDateJump = new Date(currentDateJump); // Cria uma nova instância para evitar problemas de referência
            currentDateJump.setUTCDate(currentDateJump.getUTCDate() + jump); // Adiciona o salto de dias
        }

        return dates;
    }

    async validateRecurrenceUser(date, recurrenceUser) {
        const currentDate = this.formateDateRequest(date)
        const start_date = this.formateDateRequest(recurrenceUser.start_date)

        const dates = await this.getDates(start_date, recurrenceUser.range_days, currentDate);

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