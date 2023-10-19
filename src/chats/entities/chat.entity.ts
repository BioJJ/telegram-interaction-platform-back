import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from 'src/bases/entities/base.entity'
import { Bot } from 'src/bots/entities/bot.entity'
import { User } from 'src/users/entities/user.entity'

@Entity()
export class Chat extends BaseEntity {
	@Column({ unique: true, name: 'chat_id' })
	chatId: number

	@Column()
	username: string

	@Column()
	type: string

	@ManyToOne(() => Bot, (bot) => bot.chats)
	bot: Bot

	@ManyToMany(() => User, (user) => user.chats)
	users: User[]
}
