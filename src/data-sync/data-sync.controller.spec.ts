import { Test, TestingModule } from '@nestjs/testing';
import { DataSyncController } from './data-sync.controller';

describe('DataSyncController', () => {
  let controller: DataSyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataSyncController],
    }).compile();

    controller = module.get<DataSyncController>(DataSyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
