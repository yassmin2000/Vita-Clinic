import { Module } from '@nestjs/common';
import { BiomarkController } from './biomark.controller';
import { BiomarkService } from './biomark.service';

@Module({
  controllers: [BiomarkController],
  providers: [BiomarkService]
})
export class BiomarkModule {}
