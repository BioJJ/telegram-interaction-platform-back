import { IsNotEmpty } from 'class-validator'
import { Bot } from 'src/bots/entities/bot.entity'

export class CreateChatDto {
	@IsNotEmpty()
	chatId: number

	@IsNotEmpty()
	username: string

	@IsNotEmpty()
	type: string

	@IsNotEmpty()
	bot: Bot
}
