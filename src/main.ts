import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins (replace with your frontend URL in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable cookies/auth headers if needed
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Market API')
    .setDescription('API documentation for L.I.M.S system by Brian Mutai')
    .setContact(
      'Brian  - Software Engineer',
      'https://lims.system.com',
      'kbrinamutai@gmail.com',
    )
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer token authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start the application
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
 