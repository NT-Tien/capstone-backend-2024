import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { BaseService } from 'src/common/base/service.base';
import { IssueSparePartEntity, IssueSparePartStatus } from 'src/entities/issue-spare-part.entity';
import { SparePartEntity } from 'src/entities/spare-part.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SparePartService extends BaseService<IssueSparePartEntity> {
  constructor(
    @InjectRepository(SparePartEntity)
    private readonly issueSparePartRepository: Repository<IssueSparePartEntity>,
  ) {
    super(issueSparePartRepository);
  }

  async checkReceipt(sparepartIdList: string[]): Promise<boolean> {    
    try {
      for (const sparepartId of sparepartIdList) {        
        const data = await this.issueSparePartRepository.findOne({ where: { id: sparepartId } });
        if (data) {
          data.status = IssueSparePartStatus.RECIEVED;
          await this.issueSparePartRepository.save(data);
        } else {
          console.warn(`Spare part with ID ${sparepartId} not found.`);
        }
      }
      return true; 
    } catch (error) {
        console.error('Error in checkReceipt:', error);
        return false; // Return false if any operation fails
    }
  }


  async checkReturn(sparepartIdList: string[]): Promise<boolean> {
    try {
      for (const sparepartId of sparepartIdList) {        
        const data = await this.issueSparePartRepository.findOne({ where: { id: sparepartId } });
        log(data);
        if (data != null) {
          log(data.id + "ok");
          data.status = IssueSparePartStatus.RETURNED;
          await this.issueSparePartRepository.save(data);
        } else {
          console.warn(`Spare part with ID ${sparepartId} not found.`);
        }
      }
      return true; 
    } catch (error) {
        console.error('Error in checkReturn:', error);
        return false; // Return false if any operation fails
    }
  }

}
