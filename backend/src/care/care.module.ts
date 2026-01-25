import { Module } from '@nestjs/common';
import { CareController } from './care.controller';
import { CareService } from './care.service';
import { CarePlanGenerator } from './care-plan-generator';

@Module({
  controllers: [CareController],
  providers: [CareService, CarePlanGenerator],
  exports: [CareService],
})
export class CareModule {}
