import { Test, TestingModule } from '@nestjs/testing';
import { LivestockTypesService } from './livestock-types.service';

describe('LivestockTypesService', () => {
  let service: LivestockTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LivestockTypesService],
    }).compile();

    service = module.get<LivestockTypesService>(LivestockTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
