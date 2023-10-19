import { Body, Controller, Post } from '@nestjs/common'
import { TelegramService } from './telegram.service'

@Controller('telegram')
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) {}

	@Post('send-message')
	async sendMessage(@Body() msgDto: { chatId: string; messageText: string }) {
		return await this.telegramService.sendMessageToTelegram(
			msgDto.chatId,
			msgDto.messageText
		)
	}
}
