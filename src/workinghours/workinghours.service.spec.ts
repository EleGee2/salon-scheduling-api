import { Test, TestingModule } from '@nestjs/testing';
import { WorkinghoursService } from './workinghours.service';

describe('WorkinghoursService', () => {
  let service: WorkinghoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkinghoursService],
    }).compile();

    service = module.get<WorkinghoursService>(WorkinghoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
