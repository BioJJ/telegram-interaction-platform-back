import { IsNotEmpty, IsOptional } from 'class-validator'
import { Bot } from 'src/bots/entities/bot.entity'
import { Chat } from 'src/chats/entities/chat.entity'
import { User } from 'src/users/entities/user.entity'

export class CreateMessageDto {
	@IsNotEmpty()
	messageId: number

	@IsNotEmpty()
	text: string

	@IsNotEmpty()
	isBot: boolean

	@IsNotEmpty()
	sender: bigint

	@IsNotEmpty()
	senderUsername: string

	@IsNotEmpty()
	timestamp: Date

	@IsNotEmpty()
	chat: Chat

	@IsOptional()
	user: User

	@IsNotEmpty()
	bot: Bot
}
