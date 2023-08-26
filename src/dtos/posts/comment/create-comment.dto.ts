import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  public comment!: string

  @IsNotEmpty()
  @IsString()
  public userId!: string
}
