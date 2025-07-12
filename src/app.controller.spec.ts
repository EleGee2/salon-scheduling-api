import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { SuccessResponseObject } from '@common/utils/http';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return root response', () => {
      const got = appController.root();
      const expected = new SuccessResponseObject('salon scheduling api', null);

      expect(got).toEqual(expected);
    });
  });
});
