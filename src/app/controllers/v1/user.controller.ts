import {Request, Response, NextFunction} from 'express';

import {UserService} from '../../services/v1/user.service';
import {IComplements, IUser} from '../../../resources/interfaces';
import {ComplementResponse} from '../generic';
import {UploadAnyFiles} from '../../../utils/UploadFiles';
const Path = require('path');

export class UserController {
  private complementResponse = new ComplementResponse();
  private userService = new UserService();
  //   'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any> {

  changeUserState = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IUser.UserStateLog = request.body;
    const content = await this.userService.changeUserState(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  getUserInfoById = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: IUser.ID = request.body;
    console.log('dataaa');
    const content = await this.userService.getUserInfoById(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };

  updateTypePostion = async (
    request: Request,
    response: Response,
    nextOrError: NextFunction
  ) => {
    const data: any = request.body;
    console.log('datae', data);
    const content = await this.userService.updateTypePostion(data);
    await this.complementResponse.returnData(response, nextOrError, content);
  };
}
