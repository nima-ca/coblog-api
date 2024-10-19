import {
    ClassSerializerInterceptor,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Add helmet for more security
    app.use(helmet());

    // Version config
    app.enableVersioning({ type: VersioningType.URI });

    const isProductionEnv = process.env.NODE_ENV === 'production';

    // Enable swagger on development env
    if (!isProductionEnv) {
        const config = new DocumentBuilder()
            .setTitle('Coblog API')
            .setDescription('Coblog api documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('swagger', app, document);
    }

    // Validation config
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    const configService = app.get(ConfigService);
    const port = configService.get('port');
    const frontEndDomain = configService.get('frontEndDomain');

    // Enable cors on production env
    app.enableCors({
        origin: '*',
    });

    await app.listen(port);
}

bootstrap();
