import { Test, TestingModule } from '@nestjs/testing';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';

describe('DeployController', () => {
  let deployController: DeployController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DeployController],
      providers: [DeployService],
    }).compile();

    deployController = app.get<DeployController>(DeployController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(deployController.getHello()).toBe('Hello World!');
    });
  });
});
