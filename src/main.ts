import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';
import { RequestResponseTransformInterceptor } from './interceptors/request-response-transform.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //change respone according to needs
  app.useGlobalInterceptors(new RequestResponseTransformInterceptor());

  await app.listen(env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
