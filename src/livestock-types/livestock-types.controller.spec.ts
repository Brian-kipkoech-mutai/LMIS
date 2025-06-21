import { Test, TestingModule } from '@nestjs/testing';
import { LivestockTypesController } from './livestock-types.controller';

describe('LivestockTypesController', () => {
  let controller: LivestockTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivestockTypesController],
    }).compile();

    controller = module.get<LivestockTypesController>(LivestockTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
