import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WagerModule } from './wager/wager.module';

@Module({
  imports: [WagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
