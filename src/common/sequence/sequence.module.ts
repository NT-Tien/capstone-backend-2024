import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SequenceService } from 'src/common/sequence/sequence.service';
import { SequenceEntity } from 'src/entities/sequence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SequenceEntity])],
  providers: [SequenceService],
  exports: [SequenceService],
})
export class SequenceModule {}
