import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateChatDto } from './dto/create-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { Chat } from './entities/chat.entity'

@Injectable()
export class ChatsService {
	constructor(
		@InjectRepository(Chat)
		private readonly ChatRepository: Repository<Chat>
	) {}

	async create(createChatDto: CreateChatDto): Promise<Chat> {
		const chatPartial: DeepPartial<Chat> =
			this.mapChatDtoToChatPartial(createChatDto)

		const Chat = this.ChatRepository.create(chatPartial)

		return await this.ChatRepository.save(Chat)
	}

	async update(id: number, updateChatDto: UpdateChatDto) {
		const chatPartial: DeepPartial<Chat> =
			this.mapChatDtoToChatPartial(updateChatDto)

		const Chat = await this.findOne(id)

		this.ChatRepository.merge(Chat, chatPartial)
		await this.ChatRepository.save(Chat)
	}

	async findAll(): Promise<Chat[]> {
		return await this.ChatRepository.find({
			select: ['id', 'username', 'chatId', 'type', 'bot'],
			relations: {
				bot: true
			}
		})
	}

	async findOne(id: number): Promise<Chat> {
		const Chat = await this.ChatRepository.findOne({
			select: ['id', 'username', 'chatId', 'type', 'bot'],
			where: { id },
			relations: {
				bot: true
			}
		})

		if (!id) {
			throw new NotFoundException(`Não achei um Chat com o id ${id}`)
		}
		return Chat
	}

	async findChatId(chatId: number): Promise<Chat> {
		return await this.ChatRepository.findOne({
			select: ['id', 'username', 'chatId', 'type', 'bot'],
			where: { chatId },
			relations: {
				bot: true
			}
		})
	}

	async remove(id: number): Promise<void> {
		await this.findOne(id)

		if (!id) {
			throw new NotFoundException(`Não achei um Chat com o id ${id}`)
		}
		this.ChatRepository.softDelete({ id })
	}

	private mapChatDtoToChatPartial(
		createChatDto: CreateChatDto | UpdateChatDto
	): DeepPartial<Chat> {
		return {
			username: createChatDto.username,
			chatId: createChatDto.chatId,
			type: createChatDto.type,
			bot: createChatDto.bot
		}
	}
}
