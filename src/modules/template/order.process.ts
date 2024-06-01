// import { Process, Processor } from '@nestjs/bull';
// import { Inject } from '@nestjs/common';
// import { Job } from 'bull';
// import { OrderService } from './order.service';

// @Processor('order-queue')
// export class OrderProcessor {
//   constructor(
//     @Inject('ORDER_SERVICE_TIENNT') private orderService: OrderService,
//   ) {}

//   @Process()
//   async processJob(job: Job<any>) {
//     try {
//       const { data } = job;
//       return await this.orderService.createOrder(data.data);
//     } catch (error) {
//       return error.toString();
//     }
//   }
// }
