// import { InjectRepository } from '@nestjs/typeorm';
// import { OrderItemEntity } from '../../../entities/order-item.entity';
// import { BaseService } from 'src/common/base/service.base';
// import { Injectable } from '@nestjs/common';
// import { OrderEntity } from 'src/entities/order.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class AdminOrderService extends BaseService<OrderEntity> {
//   constructor(
//     @InjectRepository(OrderEntity)
//     private readonly orderRepository: Repository<OrderEntity>,
//     @InjectRepository(OrderItemEntity)
//     private readonly orderItemRepository: Repository<OrderItemEntity>,
//   ) {
//     super(orderRepository);
//   }

//   async createOrderItem(data: OrderItemEntity): Promise<OrderItemEntity> {
//     return this.orderItemRepository.save(data);
//   }

//   async updateOrderItem(id: string, data: OrderItemEntity): Promise<any> {
//     return this.orderItemRepository.update(id, data);
//   }

//   async deleteOrderItem(id: string): Promise<any> {
//     return this.orderItemRepository.delete(id);
//   }

//   async getOrderItems(): Promise<OrderItemEntity[]> {
//     return this.orderItemRepository.find();
//   }

//   async getOrderItem(id: string): Promise<OrderItemEntity> {
//     return this.orderItemRepository.findOne({ where: { id } });
//   }

//   async getOrderItemsByOrderId(orderId: string): Promise<OrderEntity[]> {
//     const order = await this.orderRepository.findOne({
//       where: { id: orderId },
//     });
//     if (!order) {
//       throw new Error('Order not found');
//     }
//     return this.orderRepository.find({
//       where: { id: orderId },
//       relations: ['items', 'items.opt'],
//     });
//   }
// }
