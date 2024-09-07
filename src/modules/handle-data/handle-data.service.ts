import { Injectable } from "@nestjs/common";

@Injectable()
export class HandleDataService {
  // add your code here

  async getFinishDate(create_at: string, totalTime: number) {
    const date = new Date(create_at);
    date.setMinutes(date.getMinutes() + totalTime);
    return date.toISOString();
  }

  

}