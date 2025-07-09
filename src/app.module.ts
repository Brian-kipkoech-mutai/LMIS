import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
// Configs
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

//interceptors
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './audit/interceptors/audit.interceptor';

//middleware
import { AuditMiddleware } from './audit/middlware/audit.middlware';
// Feature Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { MarketsModule } from './markets/markets.module';
import { RegionsModule } from './regions/regions.module';
import { LivestockTypesModule } from './livestock-types/livestock-types.module';
import { GradesModule } from './grades/grades.module';
import { PriceReportsModule } from './price-reports/price-reports.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';
import { HealthModule } from './health/health.module';
import { DataSyncModule } from './data-sync/data-sync.module';
import { CronModule } from './cron/cron.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import sendGridConfig from './config/sendGrid.config';
import smsConfig from './config/sms.config';
 

@Module({
  imports: [
    // Load environment and config files
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env.development.local',
      load: [databaseConfig, jwtConfig, sendGridConfig,smsConfig],
    }),

    // TypeORM with async config from @nestjs/config
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get('database');
        console.log('Database config:', dbConfig);
        return {
          ...dbConfig,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    RolesModule,
    MarketsModule,
    RegionsModule,
    LivestockTypesModule,
    GradesModule,
    PriceReportsModule,
    AnalyticsModule,
    ReportsModule,
    DashboardModule,
    NotificationsModule,
    EmailModule,
    SmsModule,
    HealthModule,
    DataSyncModule,
    CronModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditMiddleware).forRoutes('*'); // Apply to all routes
  }
}
