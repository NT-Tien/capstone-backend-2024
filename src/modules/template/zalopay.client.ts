// import { HttpException, Inject, Injectable } from '@nestjs/common';
// import * as io from 'socket.io-client';
// import * as CryptoJS from 'crypto-js';
// import * as dotenv from 'dotenv';
// import { OrderEntity, OrderStatus } from 'src/entities/order.entity';
// import { OrderService } from '../order.service';
// import { DataSource } from 'typeorm';
// import { ProductOptEntity } from 'src/entities/product-opt.entity';
// import { ZaloPayRefund, ZaloPayService } from './zalo-pay.service';
// dotenv.config();

// const config = {
//   key2: process.env.ZALO_PAY_KEY2,
//   socket_url: process.env.ZALO_PAY_SOCKET,
// };

// @Injectable()
// export class SocketService {
//   private socket: any;

//   constructor(
//     @Inject('ORDER_SERVICE_TIENNT') private readonly orderService: OrderService,
//     @Inject('ZALOPAY_SERVICE_TIENNT')
//     private readonly zaloPayService: ZaloPayService,
//     private dataSource: DataSource, // for transaction
//   ) {
//     this.socket = io.connect(config.socket_url, { reconnection: true });
//     this.setupListeners();
//   }

//   private async setupListeners(): Promise<void> {
//       this.socket.on('new-payment', async (data: any) => {
//         console.log('Received new payment:', data);

//         const result = {
//           return_code: 1,
//           return_message: 'success',
//         };

//         try {
//           const dataStr = data.message.data;
//           const reqMac = data.message.mac;

//           const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

//           // kiểm tra callback hợp lệ (đến từ ZaloPay server)
//           if (reqMac !== mac) {
//             // callback không hợp lệ
//             result.return_code = -1;
//             result.return_message = 'mac not equal';
//           } else {
//             // thanh toán thành công
//             // merchant cập nhật trạng thái cho đơn hàng
//             const dataJson = JSON.parse(dataStr, config.key2 as any);
//             console.log(
//               "update order's status = success where app_trans_id =",
//               dataJson['app_trans_id'],
//             );
//             result.return_code = 1;
//             result.return_message = 'success';
//             const status =
//               await this.orderService.updateOrderStatusWithAppTransId(
//                 dataJson['app_trans_id'],
//                 OrderStatus.PAID,
//               );
//             console.log('status = ', status);
//             // get order by app_trans_id
//             const order = await this.orderService.getOrderByAppTransId(
//               dataJson['app_trans_id'],
//             );
//             // update zp_trans_id
//             await this.orderService.update(order.id, {
//               zp_trans_id: dataJson['zp_trans_id'],
//             });
//             // update product quantity
//             await this.updateProductQuantity(order, {
//               zp_trans_id: dataJson['zp_trans_id'].toString(),
//               amount: dataJson['amount'],
//               description: 'Refund for out of stock product',
//             });
//           }
//         } catch (ex) {
//           result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
//           result.return_message = ex.message;
//         }

//         console.log('result webhook = ', result);
//       });
//   }

//   private async updateProductQuantity(
//     order: OrderEntity,
//     refund: ZaloPayRefund,
//   ): Promise<void> {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction('SERIALIZABLE');
//     try {
//       for (const item of order.items) { 
//         item.opt.quantity -= item.quantity;
//         if (item.opt.quantity < 0) {
//           throw new HttpException(
//             `Product ${item.opt.name} is out of stock`,
//             400,
//           );
//         }
//         await queryRunner.manager.save('PRODUCT_OPT', item.opt);
//       }
//       await queryRunner.commitTransaction();
//     } catch (e) {
//       await this.refund(refund, order.id);
//       await queryRunner.rollbackTransaction();
//       throw new HttpException(e, 500);
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   private async refund(data: ZaloPayRefund, orderId: string): Promise<any> {
//     console.log('refund data = ', data);
//     const result = await this.zaloPayService.refund(data);
//     // update order status
//     await this.orderService.updateOrderStatus(
//       orderId,
//       OrderStatus.REFUND,
//       data.description,
//     );

//   }
// }
