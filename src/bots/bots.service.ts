import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateBotDto } from './dto/create-bot.dto'
import { UpdateBotDto } from './dto/update-bot.dto'
import { Bot } from './entities/bot.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

@Injectable()
export class BotsService {
	constructor(
		@InjectRepository(Bot)
		private readonly botRepository: Repository<Bot>
	) {}

	async create(createBotDto: CreateBotDto): Promise<Bot> {
		const botPartial: DeepPartial<Bot> =
			this.mapBotDtoToBotPartial(createBotDto)

		const Bot = this.botRepository.create(botPartial)

		return await this.botRepository.save(Bot)
	}

	async update(id: number, updateBotDto: UpdateBotDto) {
		const BotPartial: DeepPartial<Bot> =
			this.mapBotDtoToBotPartial(updateBotDto)

		const Bot = await this.findOne(id)

		this.botRepository.merge(Bot, BotPartial)
		await this.botRepository.save(Bot)
	}

	async findAll(): Promise<Bot[]> {
		return await this.botRepository.find({
			select: ['id', 'username', 'name', 'telegramId', 'status'],
			where: { status: true }
		})
	}

	async findOne(id: number): Promise<Bot> {
		const Bot = await this.botRepository.findOne({
			select: ['id', 'username', 'name', 'telegramId', 'status'],
			where: { id }
		})

		if (!id) {
			throw new NotFoundException(`Não achei um Bot com o id ${id}`)
		}
		return Bot
	}

	async findUserName(username: string): Promise<Bot> {
		return await this.botRepository.findOne({
			select: ['id', 'username', 'name', 'telegramId', 'status'],
			where: { username }
		})
	}

	async remove(id: number): Promise<void> {
		await this.findOne(id)

		if (!id) {
			throw new NotFoundException(`Não achei um Bot com o id ${id}`)
		}
		this.botRepository.softDelete({ id })
	}

	private mapBotDtoToBotPartial(
		createBotDto: CreateBotDto | UpdateBotDto
	): DeepPartial<Bot> {
		return {
			username: createBotDto.username,
			name: createBotDto.name,
			telegramId: createBotDto.telegramId,
			status: createBotDto.status
		}
	}
}
