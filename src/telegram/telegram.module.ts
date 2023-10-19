import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { ConfigModule } from '@nestjs/config'
import { BotsModule } from 'src/bots/bots.module'
import { TelegramController } from './telegram.controller'
import { ChatsModule } from 'src/chats/chats.module'
import { MessageModule } from 'src/message/message.module'

@Module({
	imports: [ConfigModule, BotsModule, ChatsModule, MessageModule],
	providers: [TelegramService],
	controllers: [TelegramController]
})
export class TelegramModule {}
