import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

describe('HelloController', () => {
  let HelloController: HelloController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [HelloService],
    }).compile();

    HelloController = app.get<HelloController>(HelloController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(HelloController.getHello()).toBe('Hello World!');
    });
  });
});
