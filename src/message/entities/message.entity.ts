import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from 'src/bases/entities/base.entity'
import { Bot } from 'src/bots/entities/bot.entity'
import { User } from 'src/users/entities/user.entity'
import { Chat } from 'src/chats/entities/chat.entity'

@Entity()
export class Message extends BaseEntity {
	@Column({ name: 'message_id' })
	messageId: number

	@Column()
	text: string

	@Column({ name: 'is_bot' })
	isBot: boolean

	@Column({ type: 'bigint' }) // Altere o tipo para 'bigint'
	sender: bigint

	@Column({ name: 'sender_username' })
	senderUsername: string

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	timestamp: Date

	@ManyToOne(() => Chat)
	chat: Chat

	@ManyToOne(() => User)
	user: User

	@ManyToOne(() => Bot, (bot) => bot.messages)
	bot: Bot
}
