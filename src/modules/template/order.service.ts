// import { HttpException, Inject, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
// import { OrderEntity, OrderStatus } from '../../../entities/order.entity';
// import { UserOrderRequestDto } from '../dto/user-request.dto';
// import { ProductOptEntity } from 'src/entities/product-opt.entity';
// import { VoucherEntity } from 'src/entities/voucher.entity';
// import { ZaloPayService } from './zalo-pay/zalo-pay.service';
// import { OrderItemEntity } from 'src/entities/order-item.entity';
// import { BaseService } from 'src/common/base/service.base';
// import { RecordUsedVoucherEntity } from 'src/entities/record-used-voucher.entity';

// @Injectable()
// export class OrderService extends BaseService<OrderEntity> {
//   constructor(
//     @InjectRepository(OrderEntity)
//     private readonly orderRepository: Repository<OrderEntity>,
//     @Inject('ZALOPAY_SERVICE_TIENNT')
//     private readonly zaloPayService: ZaloPayService,
//     private dataSource: DataSource, // for transaction
//   ) {
//     super(orderRepository);
//   }

//   async createOrder(data: UserOrderRequestDto.CreateOrderDto): Promise<any> {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction('SERIALIZABLE');
//     try {
//       // check user have any order is pending
//       const list = await queryRunner.manager.findOne('ORDER', {
//         where: { email: data.email, status: OrderStatus.PENDING },
//       });
//       console.log('list', list);
      
//       if (list) {
//         throw new HttpException(
//           `User ${data.email} have order is pending`,
//           400,
//         );
//       }
//       let total = 0;
//       // check product quantity
//       for (const item of data.items) {
//         const optProduct = (await queryRunner.manager.findOne('PRODUCT_OPT', {
//           where: { id: item.id },
//         })) as ProductOptEntity;
//         if (!optProduct) {
//           throw new HttpException(`Product ${item.name} is invalid`, 400);
//         }
//         if (optProduct.quantity < item.quantity) {
//           throw new HttpException(
//             `Product ${optProduct.name} is out of stock`,
//             400,
//           );
//         } else if (optProduct.price != item.price) {
//           throw new HttpException(
//             `Price of product ${optProduct.name} is invalid`,
//             400,
//           );
//         } else if (optProduct.name != item.name) {
//           throw new HttpException(
//             `Name of product ${optProduct.name} is invalid`,
//             400,
//           );
//         } else if (optProduct.deletedAt != null) {
//           throw new HttpException(`Product ${optProduct.name} is deleted`, 400);
//         }
//         total += optProduct.price * item.quantity;
//       }
//       // check vouher is valid if have voucher
//       let voucher: VoucherEntity;
//       if (data.voucher) {
//         // check voucher
//         voucher = (await queryRunner.manager.findOne('VOUCHER', {
//           where: { code: data.voucher },
//         })) as VoucherEntity;
//         if (!voucher) {
//           throw new HttpException(`Voucher ${data.voucher} is invalid`, 400);
//         }
//         // check limit
//         if (voucher.limit > total) {
//           throw new HttpException(`Voucher ${data.voucher} is invalid`, 400);
//         }
//         // check price with voucher
//         if (total - voucher.discount < 0) {
//           if (total - voucher.discount != data.total) {
//             throw new HttpException(`Total order is invalid`, 400);
//           }
//           total = 0;
//         } else {
//           total = total - voucher.discount;
//         }
//         // check voucher startAt
//         if (voucher.startAt > new Date()) {
//           throw new HttpException(
//             `Voucher ${data.voucher} is not available`,
//             400,
//           );
//         }
//         // check voucher is expired
//         if (voucher.expiredAt < new Date()) {
//           throw new HttpException(`Voucher ${data.voucher} is expired`, 400);
//         }
//         // check record used voucher
//         const records = await queryRunner.manager
//           .createQueryBuilder(RecordUsedVoucherEntity, 'recordUsedVoucher')
//           .innerJoin('recordUsedVoucher.voucher', 'voucher')
//           .innerJoin('recordUsedVoucher.user', 'user')
//           .where('voucher.id = :voucherId', { voucherId: voucher.id })
//           .andWhere('user.id = :userId', { userId: data.user })
//           .select(['recordUsedVoucher.id', 'voucher.id', 'user.id'])
//           .getMany();
//         if (records.length >= voucher.usedTime) {
//           throw new HttpException(`Voucher ${data.voucher} is used up`, 400);
//         }
//         // record voucher used by user
//         await queryRunner.manager.save('RECORD_USED_VOUCHER', {
//           voucher: voucher.id,
//           user: data.user,
//         });
//       }
//       // check data total and total order
//       if (data.total != total) {
//         throw new HttpException(`Total order is invalid`, 400);
//       }
//       // create link payment
//       let result: any = {
//         message: 'ORDER 0 VND',
//       };
//       if (total > 0) {
//         result = await this.zaloPayService.createOrder(total);
//       }
//       // create order
//       const order = (await queryRunner.manager.save('ORDER', {
//         email: data.email,
//         phone: data.phone,
//         username: data.username,
//         address: data.address,
//         total: total,
//         voucher: voucher ? voucher.id : null,
//         items: data.items,
//         status: OrderStatus.PENDING,
//         payment: result,
//         app_trans_id: result.info.app_trans_id,
//       })) as OrderEntity;
//       // save order items
//       for (const item of data.items) {
//         await queryRunner.manager.save('ORDER_ITEM', {
//           order: order.id,
//           opt: item.id,
//           name: item.name,
//           quantity: item.quantity,
//           price: item.price,
//         });
//       }
//       await queryRunner.commitTransaction();
//       return order;
//     } catch (e) {
//       await queryRunner.rollbackTransaction();
//       throw new HttpException(e, 500);
//     } finally {
//       await queryRunner.release();
//     }
//   }
//   updateOrderStatusForSchedule(id: string, status: OrderStatus): Promise<any> {
//     return this.orderRepository.update(id, { status });
//   }
//   updateOrderStatus(
//     id: string,
//     status: OrderStatus,
//     note?: string,
//   ): Promise<any> {
//     return this.orderRepository.update(id, { status: status, note: note });
//   }
//   getOrdersByStatus(status: OrderStatus): Promise<any> {
//     return this.orderRepository.find({ where: { status } });
//   }
//   async updateOrderStatusWithAppTransId(
//     app_trans_id: string,
//     status: OrderStatus,
//   ): Promise<any> {
//     const result = await this.orderRepository
//       .createQueryBuilder()
//       .update(OrderEntity)
//       .set({ status })
//       .where("payment->'info'->>'app_trans_id' = :app_trans_id", {
//         app_trans_id,
//       })
//       .execute();
//     return result;
//   }
//   getOrderByAppTransId(app_trans_id: string): Promise<any> {
//     return this.orderRepository.findOne({
//       where: { app_trans_id },
//       relations: ['items', 'items.opt'],
//     });
//   }
//   getOrderByUser(email: string): Promise<any> {
//     return this.orderRepository.find({ where: { email: email }, relations: ['items', 'items.opt'] });
//   }
// }
