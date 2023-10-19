import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { Message } from './entities/message.entity'

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private readonly MessageRepository: Repository<Message>
	) {}

	async create(createMessageDto: CreateMessageDto): Promise<Message> {
		const MessagePartial: DeepPartial<Message> =
			this.mapMessageDtoToMessagePartial(createMessageDto)

		const Message = this.MessageRepository.create(MessagePartial)

		return await this.MessageRepository.save(Message)
	}

	async update(id: number, updateMessageDto: UpdateMessageDto) {
		const MessagePartial: DeepPartial<Message> =
			this.mapMessageDtoToMessagePartial(updateMessageDto)

		const Message = await this.findOne(id)

		this.MessageRepository.merge(Message, MessagePartial)
		await this.MessageRepository.save(Message)
	}

	async findAll(): Promise<Message[]> {
		return await this.MessageRepository.find({
			select: [
				'id',
				'messageId',
				'text',
				'isBot',
				'sender',
				'timestamp',
				'chat',
				'bot'
			],
			relations: {
				bot: true,
				chat: true
			}
		})
	}

	async findOne(id: number): Promise<Message> {
		const Message = await this.MessageRepository.findOne({
			select: [
				'id',
				'messageId',
				'text',
				'isBot',
				'sender',
				'timestamp',
				'chat',
				'bot'
			],
			where: { id },
			relations: {
				bot: true,
				chat: true
			}
		})

		if (!id) {
			throw new NotFoundException(`Não achei um Message com o id ${id}`)
		}
		return Message
	}

	async findMessageId(messageId: number): Promise<Message> {
		return await this.MessageRepository.findOne({
			select: [
				'id',
				'messageId',
				'text',
				'isBot',
				'sender',
				'timestamp',
				'chat',
				'bot'
			],
			where: { messageId },
			relations: {
				bot: true,
				chat: true
			}
		})
	}

	async remove(id: number): Promise<void> {
		await this.findOne(id)

		if (!id) {
			throw new NotFoundException(`Não achei um Message com o id ${id}`)
		}
		this.MessageRepository.softDelete({ id })
	}

	private mapMessageDtoToMessagePartial(
		createMessageDto: CreateMessageDto | UpdateMessageDto
	): DeepPartial<Message> {
		return {
			messageId: createMessageDto.messageId,
			text: createMessageDto.text,
			isBot: createMessageDto.isBot,
			sender: createMessageDto.sender,
			senderUsername: createMessageDto.senderUsername,
			timestamp: createMessageDto.timestamp,
			chat: createMessageDto.chat,
			user: createMessageDto.user,
			bot: createMessageDto.bot
		}
	}
}
