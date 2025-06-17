import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketsModule } from './markets/markets.module';
import { Market } from './markets/markets.entity'; // Import the Market entity
@Module({
  imports: [
    // TypeORM Configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost', // Will be 'postgres' in Docker
      port: parseInt(process.env.DB_PORT || '5432') || 5432,
      username: process.env.DB_USERNAME || 'lmis_user',
      password: process.env.DB_PASSWORD || 'securepass123',
      database: process.env.DB_NAME || 'lmis_db',
      entities: [Market], // Add other entities here later
      synchronize: process.env.NODE_ENV !== 'production', // Auto-create tables (disable in prod)
      logging: true, // Helpful for debugging
    }),
    // Feature Modules (example)
    TypeOrmModule.forFeature([Market]),
    MarketsModule, // Enables repository injection
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

