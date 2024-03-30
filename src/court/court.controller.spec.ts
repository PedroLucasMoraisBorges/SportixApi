import { Test, TestingModule } from '@nestjs/testing';
import { CourtController } from './court.controller';
import { CourtService } from './court.service';

describe('CourtController', () => {
  let controller: CourtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourtController],
      providers: [CourtService],
    }).compile();

    controller = module.get<CourtController>(CourtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
