// import { Inject, Injectable } from '@nestjs/common';
// import { Interval } from '@nestjs/schedule';
// import { OrderStatus } from 'src/entities/order.entity';
// import { OrderService } from './order.service';

// @Injectable()
// export class OrderScheduleService {
//   constructor(
//     @Inject('ORDER_SERVICE_TIENNT') private readonly orderService: OrderService,
//   ) {}

//   @Interval(3 * 60 * 1000) // Every 3 * 60 seconds
//   async checkPayment() {
//     const list_pending = await this.orderService.getOrdersByStatus(
//       OrderStatus.PENDING,
//     );
//     console.log(list_pending);
//     for (let i = 0; i < list_pending.length; i++) {
//       // for dev local
//       // console.log(new Date().getTime() - (list_pending[i].createdAt.getTime() + 7 * 60 * 60 * 1000));
//       // if (new Date().getTime() - (list_pending[i].createdAt.getTime() + 7 * 60 * 60 * 1000) > 15 * 60 * 1000) {
//       //     await this.orderService.updateOrderStatusForSchedule(list_pending[i].id, OrderStatus.EXPIRED);
//       // }
//       // for production
//       console.log(
//         'check pedding',
//         new Date().getTime() - list_pending[i].createdAt.getTime(),
//       );
//       if (
//         new Date().getTime() - list_pending[i].createdAt.getTime() >
//         15 * 60 * 1000
//       ) {
//         await this.orderService.updateOrderStatusForSchedule(
//           list_pending[i].id,
//           OrderStatus.EXPIRED,
//         );
//       }
//     }
//   }
// }
