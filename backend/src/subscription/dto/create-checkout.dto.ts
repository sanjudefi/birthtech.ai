import { IsString, IsIn } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  @IsIn(['basic', 'premium'])
  planType: string;
}
