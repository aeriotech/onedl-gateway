import { IsInt, IsUUID } from 'class-validator'

export class CreateDiscountDto {
  @IsUUID()
  uuid: string

  @IsInt()
  max?: number

  @IsInt()
  parts?: number
}
