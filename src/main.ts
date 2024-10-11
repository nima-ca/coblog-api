import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Validation config
    app.useGlobalPipes(
        new ValidationPipe({ transform: true, whitelist: true }),
    );

    // Version config
    app.enableVersioning({ type: VersioningType.URI });

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port);
}

bootstrap();
