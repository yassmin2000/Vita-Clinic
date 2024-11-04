import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api');

  const swaggerPassword = app.get(ConfigService).get('SWAGGER_PASSWORD');
  app.use(
    ['/api/docs'],
    basicAuth({
      challenge: true,
      users: { admin: swaggerPassword },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Vita Clinic API')
    .setDescription(
      `Vita Clinic API Documentation
      - [API Docs](/api/docs)
      - [API Docs JSON](/api/docs-json)
      - [API Docs YAML](/api/docs-yaml)`,
    )
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setContact(
      app.get(ConfigService).get('SWAGGER_CONTACT_NAME'),
      app.get(ConfigService).get('SWAGGER_CONTACT_URL'),
      app.get(ConfigService).get('SWAGGER_CONTACT_EMAIL'),
    )
    .addBearerAuth({
      type: 'http',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
      description: 'JWT Access Token',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Vita Clinic API Docs',
    customfavIcon: app.get(ConfigService).get('SWAGGER_FAV_ICON_URL'),
    url: '/api/docs',
    swaggerUrl: '/api/docs-json',
    jsonDocumentUrl: '/api/docs-json',
    yamlDocumentUrl: '/api/docs-yaml',
  });

  await app.listen(8000);
}
bootstrap();
