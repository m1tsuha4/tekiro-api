import { Test, TestingModule } from '@nestjs/testing';
import { CordlessService } from './cordless.service';

describe('CordlessService', () => {
  let service: CordlessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CordlessService],
    }).compile();

    service = module.get<CordlessService>(CordlessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
