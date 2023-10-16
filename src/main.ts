import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)

	const config = new DocumentBuilder()
		.setTitle('transaction-management-api')
		.setDescription(
			'Desenvolvimento de Sistema de Gerenciamento de Transações.'
		)
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)

	app.enableCors()

	await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000)
}
bootstrap()
