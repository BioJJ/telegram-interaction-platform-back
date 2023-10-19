import { BaseEntity } from 'src/bases/entities/base.entity'
import { Chat } from 'src/chats/entities/chat.entity'
import { Message } from 'src/message/entities/message.entity'
import { Entity, Column, OneToMany } from 'typeorm'

@Entity()
export class Bot extends BaseEntity {
	@Column()
	username: string

	@Column()
	name: string

	@Column({ name: 'telegram_id' })
	telegramId: number

	@Column({ default: true })
	status: boolean

	@OneToMany(() => Chat, (chat) => chat.bot)
	chats: Chat[]

	@OneToMany(() => Message, (message) => message.bot)
	messages: Message[]
}
