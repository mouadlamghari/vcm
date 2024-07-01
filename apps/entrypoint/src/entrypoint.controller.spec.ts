import { Test, TestingModule } from '@nestjs/testing';
import { EntrypointController } from './entrypoint.controller';
import { EntrypointService } from './entrypoint.service';

describe('EntrypointController', () => {
  let entrypointController: EntrypointController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EntrypointController],
      providers: [EntrypointService],
    }).compile();

    entrypointController = app.get<EntrypointController>(EntrypointController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(entrypointController.getHello()).toBe('Hello World!');
    });
  });
});
