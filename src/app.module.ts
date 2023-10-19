import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import * as Joi from '@hapi/joi'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { TelegramModule } from './telegram/telegram.module'
import { BotsModule } from './bots/bots.module'
import { ChatsModule } from './chats/chats.module'
import { MessageModule } from './message/message.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				POSTGRES_HOST: Joi.string().required(),
				POSTGRES_PORT: Joi.number().required(),
				POSTGRES_USER: Joi.string().required(),
				POSTGRES_PASSWORD: Joi.string().required(),
				POSTGRES_DB: Joi.string().required(),
				PORT: Joi.number()
			})
		}),
		DatabaseModule,
		UsersModule,
		AuthModule,
		TelegramModule,
		BotsModule,
		ChatsModule,
		MessageModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		}
	]
})
export class AppModule {}
