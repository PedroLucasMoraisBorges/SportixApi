import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('')
  async getFristPage(){
    return "Nada ainda"
  }
}

// Exemplo de instância no banco de dados
// @Controller()
// export class AppController {
//   constructor(private prisma: PrismaService) {}

//   @Get()
//   async getHello(){
//     const member = await this.prisma.user.create({
//       data : {
//         id : '1',
//         name  : 'Pedro',
//         cpf : '08445032313',
//         email : 'pedrulucas000@gmail.com',
//         phoneNumber : '88997974194'
//       }
//     })
//     return {
//       member,
//     }
//   }
// }




    // const member = await this.prisma.user.create({
    //   data : {
    //     id : randomUUID(),
    //     name : name,
    //     cpf : cpf,
    //     email : email,
    //     phoneNumber : phoneNumber,
    //   }
    // })
