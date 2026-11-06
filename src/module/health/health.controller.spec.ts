import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the service status and uptime', () => {
    jest.spyOn(process, 'uptime').mockReturnValue(12.5);

    expect(controller.check()).toEqual({
      status: 'ok',
      uptime: 12.5,
    });
  });
});
