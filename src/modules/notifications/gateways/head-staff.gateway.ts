import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Accounts } from 'src/common/constants';
import { AccountEntity, Role } from 'src/entities/account.entity';
import {
  NotificationEntity,
  NotificationPriority,
  NotificationType,
} from 'src/entities/notification.entity';
import { HeadStaffGuard } from 'src/modules/auth/guards/headstaff.guard';
import { Repository } from 'typeorm';

@UseGuards(HeadStaffGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
    exposedHeaders: ['x-auth-token'],
  },
  namespace: `socket/${Role.headstaff.toString()}`,
})
export class HeadStaffNotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationsRepository: Repository<NotificationEntity>,
  ) {} // add servies

  afterInit(server: any) {
    console.log('init socket head-staff');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const ip =
      client.handshake.headers['x-forwarded-for'] || client.handshake.address;
    const token = client.handshake.headers['x-auth-token'];

    console.log(ip, token, 'connected at', new Date().toLocaleString());

    setTimeout(() => {
      this.emit_init();
    }, 3000);
  }

  handleDisconnect(client: any) {
    const ip =
      client.handshake.headers['x-forwarded-for'] || client.handshake.address;
    const token = client.handshake.headers['x-auth-token'];
    console.log(ip, token, 'disconnected at', new Date().toLocaleString());
  }

  emit_init() {
    this.server.emit('dev', 'first handshake');
  }

  async emit_test(receiver: string) {
    const notification = await this.notificationsRepository.save({
      type: NotificationType.HD_CREATE_REQUEST,
      title: 'Test Notification',
      body: `${new Date().toISOString()}`,
      priority: NotificationPriority.MEDIUM,
      subject: 'test',
      receiver: {
        id: receiver,
      },
      data: null,
    });
    this.server.emit(receiver, notification);
  }

  private notificationTemplates = {
    [NotificationType.HD_CREATE_REQUEST]: async (props: {
      requester: AccountEntity;
      areaName: string;
      requestId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.HD_CREATE_REQUEST,
        sender: props.requester,
        title: 'Yêu cầu mới',
        body: `Một yêu cầu mới đã được tạo ở khu vực ${props.areaName}`,
        priority: NotificationPriority.MEDIUM,
        subject: props.requestId,
        receiver: {
          id: Accounts.HEAD_MAINTENANCE,
        },
        data: {
          areaName: props.areaName,
          requestId: props.requestId,
        },
      });
      this.server.emit(Accounts.HEAD_MAINTENANCE, notification);
    },
    [NotificationType.S_START_TASK]: async (props: {
      senderId: string
      taskName: string
      fixerName: string
      requestId: string
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.S_START_TASK,
        sender: {
          id: props.senderId,
        },
        title: 'Tác vụ đã bắt đầu',
        body: `${props.fixerName} đã bắt đầu tác vụ ${props.taskName}`,
        priority: NotificationPriority.LOW,
        subject: props.requestId,
        receiver: {
          id: Accounts.HEAD_MAINTENANCE,
        },
        data: {
          requestId: props.requestId,
        },
      });
      this.server.emit(Accounts.HEAD_MAINTENANCE, notification);
    },
    [NotificationType.HD_FEEDBACK_BAD]: async (props: {
      requestId: string;
      senderId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.HD_FEEDBACK_BAD,
        sender: {
          id: props.senderId,
        },
        title: 'Một yêu cầu cần được kiểm tra',
        body: `Vui lòng kiểm tra lại yêu cầu`,
        priority: NotificationPriority.MEDIUM,
        subject: props.requestId,
        receiver: {
          id: Accounts.HEAD_MAINTENANCE,
        },
        data: {
          requestId: props.requestId,
        },
      });
      this.server.emit(Accounts.HEAD_MAINTENANCE, notification);
    },
    [NotificationType.STOCK_ACCEPT_EXPORT_WAREHOUSE]: async (props: {
      senderId: string;
      taskName: string;
      taskId: string;
      requestId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.STOCK_ACCEPT_EXPORT_WAREHOUSE,
        sender: {
          id: props.senderId,
        },
        title: 'Đơn xuất kho đã được xác nhận',
        body: `Vui lòng phân công tác vụ ${props.taskName}`,
        priority: NotificationPriority.MEDIUM,
        subject: props.taskId,
        receiver: {
          id: Accounts.HEAD_MAINTENANCE,
        },
        data: {
          requestId: props.requestId,
        },
      });
      this.server.emit(Accounts.HEAD_MAINTENANCE, notification);
    },
    [NotificationType.S_COMPLETE_TASK_WITH_FAILED_ISSUE]: async (props: {
      senderId: string;
      taskId: string;
      requestId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.S_COMPLETE_TASK_WITH_FAILED_ISSUE,
        sender: {
          id: props.senderId,
        },
        title: 'Tác vụ có vấn đề',
        body: `Vui lòng kiểm tra lại tác vụ`,
        priority: NotificationPriority.MEDIUM,
        subject: props.taskId,
        receiver: {
          id: Accounts.HEAD_MAINTENANCE,
        },
        data: {
          taskId: props.taskId,
          requestId: props.requestId,
        },
      });
      this.server.emit(Accounts.HEAD_MAINTENANCE, notification);
    },
    [NotificationType.S_COMPLETE_WARRANTY_SEND]: async (props: {
      senderId: string;
      requestCode: string;
      requestId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.S_COMPLETE_WARRANTY_SEND,
        sender: {
          id: props.senderId,
        },
        title: `Yêu cầu ${props.requestCode}`,
        body: `Thiết bị đã được gửi đi bảo hành`,
        priority: NotificationPriority.MEDIUM,
        subject: props.requestId,
        receiver: {
          id: Accounts.HEAD_MAINTENANCE,
        },
        data: {
          requestId: props.requestId,
        },
      });
      this.server.emit(Accounts.HEAD_MAINTENANCE, notification);
    },
  };

  emit(type: NotificationType) {
    return this.notificationTemplates[type];
  }
}
