import Boom from '@hapi/boom';
import {Response, NextFunction} from 'express';
import {OK, BAD_REQUEST} from 'http-status-codes';
import {FileArray} from 'express-fileupload';

import {CODE_OK, CODE_ERROR} from '../../resources/constants/codes.constant';
import {UploadAnyFiles} from '../../utils/UploadFiles';

export class ComplementResponse {
  // Complements
  getNewSlug = (content: any, path: string) => {
    let data: any;
    const response = content;
    if (Array.isArray(response.data)) {
      data = [];
      response.data.forEach((element: any) => {
        const component = this.getSpecificData(element, path);
        data.push(component);
      });
    } else {
      data = this.getSpecificData(response.data, path);
    }
    response.data = data;
    return response;
  };

  getSpecificData = (element: any, path: string) => {
    let slug: any;
    if (typeof element === 'object') {
      slug = element.get('slug');
    } else {
      slug = element.slug;
    }
    const routeFile =
      typeof path !== 'undefined' && path !== null ? `${path}/${slug}` : slug;
    element.set('slug', routeFile);
    return element;
  };

  singleFile(body: any, images: any) {
    // Data Base
    const uploadAnyFiles = new UploadAnyFiles();
    let slug = '';
    if (typeof body.dataValues === 'undefined') {
      slug = body.slug;
    } else {
      slug = body.get('slug');
    }
    // eslint-disable-next-line no-console
    console.log(slug);
    if (typeof images !== 'undefined' && images !== null && images) {
      // Remove Files
      const routerTemp: string =
        typeof images.router !== 'undefined' && images.router !== null
          ? `${images.router}/${slug}`
          : slug;
      // Update File
      if (
        typeof images.files !== 'undefined' &&
        images.files !== null &&
        ((typeof images.upload !== 'undefined' && images.upload !== null) ||
          (typeof images.update !== 'undefined' && images.update !== null))
      ) {
        // eslint-disable-next-line no-console
        console.log('PATHS', routerTemp, slug);
        if (images.update) {
          if (typeof images.router !== 'undefined' && images.router !== null) {
            slug = '';
          }
          uploadAnyFiles.deleteFolderRecursive(images.files, routerTemp);
        }
        // Upload File
        uploadAnyFiles.uploadFiles(images.files, routerTemp);
      }
      // Single Element
      if (
        typeof images.singleFile !== 'undefined' &&
        images.singleFile !== null
      ) {
        if (images.recursive) {
          slug = routerTemp;
        }
        let file: any = uploadAnyFiles.getFile(slug);
        if (typeof file !== 'undefined' && file !== null) {
          if (
            typeof images.addUrl !== 'undefined' &&
            images.addUrl !== null &&
            typeof file !== 'undefined' &&
            file !== null
          ) {
            file = uploadAnyFiles.setURL(file);
          }
          // } else {
          //   file = uploadAnyFiles.existItemFile(slug) ? slug : 'default.png';
          // }
          // eslint-disable-next-line no-param-reassign
          body.dataValues.file = file;
        }
      }
      // List Elements
      if (typeof images.listAll !== 'undefined' && images.listAll !== null) {
        let files: any = uploadAnyFiles.getFiles(slug);
        if (typeof files !== 'undefined' && files !== null) {
          if (typeof images.addUrl !== 'undefined' && images.addUrl !== null) {
            files = uploadAnyFiles.setURL(files, true);
          }
          // eslint-disable-next-line no-param-reassign
          body.dataValues.files = files;
        }
      }
    }
  }

  returnData(
    response: Response,
    nextOrError: NextFunction,
    content: any,
    images:
      | {
          upload?: boolean;
          router?: string;
          files?: FileArray | undefined;
          update?: boolean;
          listAll?: boolean;
          singleFile?: boolean;
          pagination?: boolean;
          recursive?: Array<string>;
          getByTypeItem?: boolean;
          addUrl?: boolean;
        }
      | undefined = undefined,
    middleware: boolean = false
  ) {
    // Context Base
    let codeResponse = OK;
    let code = CODE_OK;
    // To send response
    let message: any;
    let body: any;
    if (typeof content === 'undefined' || !content || !content.status) {
      codeResponse = BAD_REQUEST;
      code = CODE_ERROR;
    }

    if (
      typeof content !== 'undefined' &&
      typeof content.message !== 'undefined' &&
      content.message
    ) {
      message = content.message;
    }
    if (typeof content !== 'undefined' && typeof content.data !== 'undefined') {
      body = content.data;

      if (typeof images !== 'undefined') {
        if (typeof images.pagination !== 'undefined') {
          body = body.data;
        }
        this.filterFiles(body, images);
        if (
          typeof images.getByTypeItem !== 'undefined' &&
          images.getByTypeItem !== null
        ) {
          const uploadAnyFiles = new UploadAnyFiles();
          body = uploadAnyFiles.getTitleItemsByType(body);
        }
      }
    }

    if (!middleware) {
      response.status(codeResponse).json({
        success: codeResponse === OK,
        code,
        message,
        body
      });
    }
    if (
      typeof content !== 'undefined' &&
      typeof content.status !== 'undefined' &&
      !content.status
    ) {
      nextOrError(Boom.badRequest(message));
    }
  }

  filterFiles(body: any, images: any) {
    if (Array.isArray(body)) {
      body.forEach((element: any) => {
        this.singleFile(element, images);
        if (typeof images.recursive !== 'undefined') {
          this.recursiveData(images.recursive, element, images);
        }
      });
    } else {
      this.singleFile(body, images);
    }
  }

  recursiveData(recursive: any, element: any, images: any) {
    recursive.forEach((item: any) => {
      if (Array.isArray(item)) {
        this.recursiveData(item, element.get(item), images);
      } else {
        // eslint-disable-next-line no-console
        console.info('Recursive: ', item);
        // Data Complement
        if (element.get(item)) {
          this.filterFiles(element.get(item), images);
        }
      }
    });
  }
}
