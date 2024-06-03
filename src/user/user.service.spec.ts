import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from './user.service';
import { CreateUserBody } from './dtos/create-user-body';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user: CreateUserBody = {
        name: 'Pedro',
        cpf: '08412345637',
        email: 'teste1@gmail.com',
        phoneNumber: '88997974194',
        password1: 'P3dro456@',
        password2: 'P3dro456@',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: 'someId',
        ...user,
        password: 'hashedPassword',
        isOwner: false,
      });

      const result = await service.create(user);

      expect(result).toEqual({
        id: 'someId',
        ...user,
        password: 'hashedPassword',
        isOwner: false, // Adiciona a propriedade isOwner
      });
    });

    it('should throw an error if passwords do not match', async () => {
      const user: CreateUserBody = {
        name: 'Pedro',
        cpf: '08412345637',
        email: 'teste1@gmail.com',
        phoneNumber: '88997974194',
        password1: 'P3dro456@',
        password2: 'DifferentPassword',
      };

      await expect(service.create(user)).rejects.toThrowError(
        'As senhas não coincidem',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'teste1@gmail.com';
      const user = {
        id: 'userId',
        name: 'Pedro',
        cpf: '08412345637',
        email: 'teste1@gmail.com',
        phoneNumber: '88997974194',
        password: 'hashedPassword',
        isOwner: false, 
      };

      // Mocka a função findUnique para retornar o usuário encontrado
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await service.findByEmail(email);

      // Verifica se a função findUnique foi chamada com o e-mail correto
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const email = 'teste2@gmail.com';

      // Mocka a função findUnique para retornar null, indicando que o usuário não foi encontrado
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.findByEmail(email);

      // Verifica se a função findUnique foi chamada com o e-mail correto
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });

      expect(result).toBeNull();
    });
  });
});
