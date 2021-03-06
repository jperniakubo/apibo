import {Request, Response, NextFunction} from 'express';

import {OnboardingService} from '../../services';
import {IUser} from '../../../resources/interfaces';
import MailerService from '../../../utils/MailerService';
import {ComplementResponse} from '../generic';

export class OnboardingController {
  private complementResponse = new ComplementResponse();
  private onboardingService = new OnboardingService();
  private mailer: MailerService = new MailerService();

  getRouterFile = () => {
    return `users/students`;
  };

  getDataFormat = async (content: any) => {
    const response: any = await this.complementResponse.getNewSlug(
      content,
      this.getRouterFile()
    );
    return response;
  };

  generateAccessToken = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // To send response
    console.log('heeeee');
    const content = this.onboardingService.generateAccessToken();
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  checkAccessToken = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const content: any = await this.onboardingService.checkAccessToken(request);
    await this.complementResponse.returnData(
      response,
      nextOrError,
      content,
      undefined,
      true
    );
    nextOrError();
  };

  checkAuthToken = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const content: any = await this.onboardingService.checkAuthToken(request);
    await this.complementResponse.returnData(
      response,
      nextOrError,
      content,
      undefined,
      true
    );
    nextOrError();
  };

  signUp = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // To send response
    let data: IUser.SignUpDTO = request.body;
    data.fullName = `${data.name} ${data.lastName}`;
    await this.onboardingService
      .signUp(data)
      .then(async (res) => {
        data = {
          ...data,
          ...res.data
        };
        const content: any = await this.onboardingService.createClient(data);
        content.data!.slug = data!.slug;
        // Send Email
        await this.mailer.SendWelcomeEmail(res.data);
        // Add Files Data
        await this.complementResponse.returnData(
          response,
          nextOrError,
          content,
          {
            upload: true,
            router: this.getRouterFile(),
            files: request.files
          }
        );
      })
      .catch(async (err) => {
        await this.complementResponse.returnData(response, nextOrError, err);
      });
  };

  confirmEmail = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const content = await this.onboardingService.confirmEmail(
      request.params.uid
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  recoveryPassword = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const content = await this.onboardingService.recoveryPassword(
      request.body.email
    );
    console.log('mmm');
    console.log('mmm');
    console.log('mmm');
    console.log('mmm');

    console.log('hhh', content);

    if (typeof content !== 'undefined' && content.status) {
      await this.mailer.SendRecoveryEmail(content.data);
    }
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  checkCode = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    const content = await this.onboardingService.checkCode(request.body.code);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  changePassword = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    console.log('mmxxxm', request.body);
    const content = await this.onboardingService.changePassword(
      request.body as IUser.RecoveryDTO
    );
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  login = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IUser.SignInDTO = request.body;
    const content = await this.onboardingService
      .login(data)
      // eslint-disable-next-line shopify/prefer-early-return
      .catch(async (error) => {
        if (error.code === 402) {
          const body = error.data;
          await this.mailer.SendWelcomeEmail(body);
        }
      });
    await this.complementResponse.returnData(response, nextOrError, content, {
      singleFile: true
    });
  };

  profile = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    // Generate Logic
    let content: any = await this.onboardingService.profile(request);
    // Add Files Data
    content = await this.getDataFormat(content);
    await this.complementResponse.returnData(response, nextOrError, content, {
      singleFile: true
    });
  };
}
