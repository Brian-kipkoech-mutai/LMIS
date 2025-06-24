import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)], // Use forwardRef to avoid circular dependency with AuthModule
  providers: [UsersService],
  exports: [UsersService], // 👈 Needed for AuthModule to inject
  controllers: [UsersController],
})
export class UsersModule {}

