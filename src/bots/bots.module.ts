import { Module } from '@nestjs/common'
import { BotsService } from './bots.service'
import { BotsController } from './bots.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Bot } from './entities/bot.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Bot])],
	controllers: [BotsController],
	providers: [BotsService],
	exports: [BotsService]
})
export class BotsModule {}
