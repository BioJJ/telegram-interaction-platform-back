import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as TelegramBot from 'node-telegram-bot-api'
import { BotsService } from 'src/bots/bots.service'
import { Bot } from 'src/bots/entities/bot.entity'
import { ChatsService } from 'src/chats/chats.service'
import { Chat } from 'src/chats/entities/chat.entity'
import { MessageService } from 'src/message/message.service'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class TelegramService {
	private bot: TelegramBot
	private logger = new Logger(TelegramService.name)

	constructor(
		private readonly configService: ConfigService,
		private readonly botService: BotsService,
		private readonly chatService: ChatsService,
		private readonly messageService: MessageService
	) {
		this.bot = new TelegramBot(configService.get('TOKEN_BOT'), {
			polling: true
		})

		this.bot.on('message', this.msgData)
	}

	onReceiveMessage = (msg: any) => {
		this.logger.debug(msg)
	}

	private msgData = async (msg: TelegramBot.Message) => {
		const {
			message_id,
			from: { id: telegramId, is_bot, first_name, username },
			chat: {
				id: chatId,
				first_name: chatFirstName,
				last_name: chatLastName,
				username: chatUsername,
				type: chatType
			},
			date,
			text
		} = msg

		const bot = await this.registerBot(
			chatId,
			chatUsername,
			`${chatFirstName} ${chatLastName}`
		)
		this.logger.debug('Bot ==> ', JSON.stringify(bot))

		const chat = await this.registerChat(chatId, chatUsername, chatType, bot)
		this.logger.debug('chat ==> ', JSON.stringify(chat))

		const message = await this.registerMessage(
			message_id,
			text,
			is_bot,
			telegramId as unknown as bigint,
			username,
			new Date(),
			chat,
			bot
		)
		this.logger.debug('Mensagem atual:', JSON.stringify(message))

		return {
			message_id,
			telegramId,
			is_bot,
			first_name,
			username,
			chatId,
			chatFirstName,
			chatLastName,
			chatUsername,
			chatType,
			date,
			text,
			async sendMessage(msgText: string): Promise<void> {
				await this.bot.sendMessage(chatId, msgText)
			}
		}
	}

	private async registerChat(
		chatId: number,
		username: string,
		type: string,
		bot: Bot
	) {
		const chat = await this.chatService.findChatId(chatId)

		if (chat) {
			this.logger.debug('Chat Encontrado ==>', chat)
			return chat
		}

		return await this.chatService.create({ chatId, username, type, bot })
	}

	private async registerMessage(
		messageId: number,
		text: string,
		isBot: boolean,
		sender: bigint,
		senderUsername: string,
		timestamp: Date,
		chat: Chat,
		bot: Bot,
		user?: User
	) {
		const message = await this.messageService.findMessageId(messageId)

		if (message) {
			this.logger.debug('Message Encontrado ==>', message)
			return message
		}

		return await this.messageService.create({
			messageId,
			text,
			isBot,
			sender,
			senderUsername,
			timestamp,
			user,
			chat,
			bot
		})
	}

	private async registerBot(
		telegramId: number,
		username: string,
		name: string
	) {
		const bot = await this.botService.findUserName(username)

		if (bot) {
			this.logger.debug('Bot Encontrado ==>', bot)
			return bot
		}

		return await this.botService.create({ telegramId, username, name })
	}

	async sendMessageToTelegram(
		chatId: string,
		messageText: string
	): Promise<void> {
		try {
			const msg = await this.bot.sendMessage(chatId, messageText)
			this.msgData(msg)
			this.logger.debug('Mensagem enviada com sucesso:', messageText)
		} catch (error) {
			this.logger.error('Erro ao enviar mensagem para o Telegram:', error)
		}
	}
}
