import { Column, Entity, BeforeInsert, ManyToMany } from 'typeorm'
import { hashSync } from 'bcrypt'
import { BaseEntity } from 'src/bases/entities/base.entity'
import { Chat } from 'src/chats/entities/chat.entity'

@Entity()
export class User extends BaseEntity {
	@Column()
	name: string

	@Column()
	email: string

	@Column()
	password: string

	@Column({ default: true })
	status: boolean

	@ManyToMany(() => Chat, (chat) => chat.users)
	chats: Chat[]

	@BeforeInsert()
	hashPassword() {
		this.password = hashSync(this.password, 10)
	}
}
