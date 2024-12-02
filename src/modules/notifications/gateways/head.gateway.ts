import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { format } from 'date-fns';
import { Server, Socket } from 'socket.io';
import { Accounts } from 'src/common/constants';
import { Role } from 'src/entities/account.entity';
import {
  NotificationEntity,
  NotificationPriority,
  NotificationType,
} from 'src/entities/notification.entity';
import { HeadGuard } from 'src/modules/auth/guards/head.guard';
import { Repository } from 'typeorm';

@UseGuards(HeadGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: `socket/${Role.head.toString()}`,
})
export class HeadNotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationsRepository: Repository<NotificationEntity>,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    const ip =
      client.handshake.headers['x-forwarded-for'] || client.handshake.address;
    const token = client.handshake.headers['x-auth-token'];
    console.log(ip, token, 'connected at', new Date().toLocaleString());

    setTimeout(() => {
      this.emit_init();
    }, 3000);
  }

  afterInit(server: any) {
    console.log('init socket head');
    ('init');
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
      receiver: {
        id: receiver,
      },
      data: null,
    });
    this.server.emit(receiver, notification);
  }

  private notificationTemplates = {
    [NotificationType.HM_REJECT_REQUEST]: async (props: {
      receiverId: string;
      checker_note: string;
      requestId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.HM_REJECT_REQUEST,
        sender: { id: Accounts.HEAD_MAINTENANCE },
        title: 'Yêu cầu đã được đóng',
        body: `Yêu cầu của bạn đã được đóng với lý do: ${props.checker_note}`,
        priority: NotificationPriority.HIGH,
        subject: props.requestId,
        receiver: { id: props.receiverId },
        data: { requestId: props.requestId },
      });
      this.server.emit(props.receiverId, notification);
    },
    [NotificationType.HM_APPROVE_REQUEST_FIX]: async (props: {
      requestId: string;
      receiverId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.HM_APPROVE_REQUEST_FIX,
        sender: { id: Accounts.HEAD_MAINTENANCE },
        title: 'Yêu cầu đã được xác nhận',
        body: 'Thiết bị sẽ được sửa chữa trong nhà máy',
        priority: NotificationPriority.HIGH,
        subject: props.requestId,
        receiver: { id: props.receiverId },
        data: { requestId: props.requestId },
      });
      this.server.emit(props.receiverId, notification);
    },
    [NotificationType.HM_APPROVE_REQUEST_WARRANTY]: async (props: {
      requestId: string;
      receiverId: string;
      sendWarrantyDate: Date;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.HM_APPROVE_REQUEST_WARRANTY,
        sender: { id: Accounts.HEAD_MAINTENANCE },
        title: 'Yêu cầu đã được xác nhận',
        body: `Thiết bị sẽ được gửi đi bảo hành vào ${format(props.sendWarrantyDate, 'dd/MM/yyyy')}`,
        priority: NotificationPriority.HIGH,
        subject: props.requestId,
        receiver: { id: props.receiverId },
        data: { requestId: props.requestId },
      });
      this.server.emit(props.receiverId, notification);
    },
    [NotificationType.HM_APPROVE_REQUEST_RENEW]: async (props: {
      requestId: string;
      receiverId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.HM_APPROVE_REQUEST_RENEW,
        sender: { id: Accounts.HEAD_MAINTENANCE },
        title: 'Yêu cầu đã được xác nhận',
        body: 'Chúng tôi sẽ thay thiết bị mới cho bạn',
        priority: NotificationPriority.HIGH,
        subject: props.requestId,
        receiver: { id: props.receiverId },
        data: { requestId: props.requestId },
      });
      this.server.emit(props.receiverId, notification);
    },
    [NotificationType.S_START_TASK]: async (props: {
      senderId: string;
      taskId: string;
      receiverId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.S_START_TASK,
        sender: { id: props.senderId },
        title: 'Yêu cầu của bạn đang được xử lý',
        body: 'Một nhân viên đã bắt đầu xử lý yêu cầu của bạn',
        priority: NotificationPriority.MEDIUM,
        subject: props.taskId,
        receiver: { id: props.receiverId },
        data: {},
      });
      this.server.emit(props.receiverId, notification);
    },
    [NotificationType.S_COMPLETE_ALL_TASKS]: async (props: {
      senderId: string;
      requestId: string;
      receiverId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.S_COMPLETE_ALL_TASKS,
        sender: {
          id: props.senderId,
        },
        title: 'Yêu cầu đã hoàn thành',
        body: `Vui lòng kiểm tra kết quả của yêu cầu`,
        priority: NotificationPriority.HIGH,
        subject: props.requestId,
        receiver: {
          id: props.receiverId,
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
