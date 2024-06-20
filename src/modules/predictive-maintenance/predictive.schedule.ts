import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

@Injectable()
export class PredictiveScheduleService {
  constructor(
    // @Inject('FILE_SERVICE') private readonly fileService: FileService, 
  ) {}

  // @Interval(1 * 10 * 1000) // Every 1 * 60 seconds
//   @Cron(CronExpression.EVERY_DAY_AT_1AM) 
  async scheduleRemove() {
    // const files = await this.fileService.getFiles();
    
    // // check file exist over 2 days
    // const now = new Date();
    // files.forEach(async (file) => {
    //   const date = new Date(file.createdAt);
      
    //   const diffTime = Math.abs(now.getTime() - date.getTime());
    //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //   if (diffDays > 2) {
    //     console.log('delete file', file.path);
    //     await this.fileService.deleteFile(file.path);
    //   }
    // });
  }
}
