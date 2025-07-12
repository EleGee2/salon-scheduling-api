import { Test, TestingModule } from '@nestjs/testing';
import { WorkinghoursController } from './workinghours.controller';
import { WorkinghoursService } from './workinghours.service';

describe('WorkinghoursController', () => {
  let controller: WorkinghoursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkinghoursController],
      providers: [WorkinghoursService],
    }).compile();

    controller = module.get<WorkinghoursController>(WorkinghoursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
