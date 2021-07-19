import { bool } from 'aws-sdk/clients/signer'
import { IsBoolean, IsString } from 'class-validator'

export class UpdateShopDto {
  @IsString()
  name: string

  @IsBoolean()
  public: bool
}
