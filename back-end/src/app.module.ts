import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VolunteersModule } from './volunteers/volunteers.module';
import { ColoniesModule } from './colonies/colonies.module';
import { VeterinaryModule } from './veterinary/veterinary.module';
import { FinanceModule } from './finance/finance.module';
import { EquipmentModule } from './equipment/equipment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'tnr_user'),
        password: config.get('DB_PASSWORD', 'tnr_password'),
        database: config.get('DB_NAME', 'tnr_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    UsersModule,
    AuthModule,
    VolunteersModule,
    ColoniesModule,
    VeterinaryModule,
    FinanceModule,
    EquipmentModule,
  ],
})
export class AppModule {}
