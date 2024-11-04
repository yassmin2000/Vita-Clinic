import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiConflictResponse,
  ApiSecurity,
  ApiTags,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiConsumes,
  ApiBody,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

interface OperationOptions {
  summary: string;
  description?: string;
}

interface ParamOptions {
  name: string;
  description?: string;
  example?: string;
  type?: Type<unknown> | Function | [Function] | string;
}

interface ResponseOptions {
  description?: string;
  type?: Type<unknown> | Function | [Function] | string;
  example?: any;
}

interface ApiDocumentationOptions {
  operation?: OperationOptions;
  params?: ParamOptions | ParamOptions[];
  notFoundResponse?: ResponseOptions;
  unauthorizedResponse?: ResponseOptions;
  forbiddenResponse?: ResponseOptions;
  badRequestResponse?: ResponseOptions;
  conflictResponse?: ResponseOptions;
  unprocessableEntityResponse?: ResponseOptions;
  createdResponse?: ResponseOptions;
  okResponse?: ResponseOptions;
  security?: string;
  tags?: string;
  consumes?: string;
  body?: ResponseOptions;
}

export function ApiDocumentation(options: ApiDocumentationOptions) {
  const decorators = [
    options.operation &&
      ApiOperation({
        summary: options.operation.summary,
        description: options.operation.description,
      }),
    Array.isArray(options.params)
      ? options.params
          .map((param) => (param && param.name ? ApiParam(param) : null))
          .filter(Boolean)
      : options.params && options.params.name
        ? ApiParam(options.params as ParamOptions)
        : null,
    options.notFoundResponse &&
      ApiNotFoundResponse({
        description: options.notFoundResponse.description,
        type: options.notFoundResponse.type,
      }),
    options.unauthorizedResponse &&
      ApiUnauthorizedResponse({
        description: options.unauthorizedResponse.description,
        type: options.unauthorizedResponse.type,
      }),
    options.forbiddenResponse &&
      ApiForbiddenResponse({
        description: options.forbiddenResponse.description,
        type: options.forbiddenResponse.type,
      }),
    options.badRequestResponse &&
      ApiBadRequestResponse({
        description: options.badRequestResponse.description,
        type: options.badRequestResponse.type,
      }),
    options.conflictResponse &&
      ApiConflictResponse({
        description: options.conflictResponse.description,
        type: options.conflictResponse.type,
      }),
    options.unprocessableEntityResponse &&
      ApiUnprocessableEntityResponse({
        description: options.unprocessableEntityResponse.description,
        type: options.unprocessableEntityResponse.type,
      }),
    options.createdResponse &&
      ApiCreatedResponse({
        description: options.createdResponse.description,
        type: options.createdResponse.type,
      }),
    options.okResponse &&
      ApiOkResponse({
        description: options.okResponse.description,
        type: options.okResponse.type,
      }),
    options.security && ApiSecurity(options.security),
    options.tags && ApiTags(options.tags),
    options.consumes && ApiConsumes(options.consumes),
    options.body &&
      ApiBody({
        description: options.body.description,
        type: options.body.type,
        examples: options.body.example,
      }),
  ].filter(Boolean);

  return applyDecorators(...[].concat(...decorators));
}
