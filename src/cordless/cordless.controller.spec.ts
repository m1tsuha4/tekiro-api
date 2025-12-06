import { Test, TestingModule } from '@nestjs/testing';
import { CordlessController } from './cordless.controller';
import { CordlessService } from './cordless.service';

describe('CordlessController', () => {
  let controller: CordlessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CordlessController],
      providers: [CordlessService],
    }).compile();

    controller = module.get<CordlessController>(CordlessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
