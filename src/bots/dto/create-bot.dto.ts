import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { BaseDTO } from 'src/bases/dto/base.dto'

export class CreateBotDto extends BaseDTO {
	@IsNotEmpty()
	@ApiProperty()
	username: string

	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsNotEmpty()
	@ApiProperty()
	telegramId: number

	@IsOptional()
	@ApiProperty()
	status?: boolean
}
