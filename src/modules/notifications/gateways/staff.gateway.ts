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
import { AccountEntity, Role } from 'src/entities/account.entity';
import {
  NotificationEntity,
  NotificationPriority,
  NotificationType,
} from 'src/entities/notification.entity';
import { TaskType } from 'src/entities/task.entity';
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';
import { Repository } from 'typeorm';

@UseGuards(StaffGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: `socket/${Role.staff.toString()}`,
})
export class StaffNotificationGateway
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
    console.log('init socket staff');
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
    [NotificationType.HM_ASSIGN_TASK]: async (props: {
      receiverId: string;
      taskType: TaskType;
      fixerDate: Date;
      taskId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.HM_ASSIGN_TASK,
        sender: {
          id: Accounts.HEAD_MAINTENANCE,
        },
        title: `[${format(props.fixerDate, 'dd/MM/yyyy')}] Tác vụ mới`,
        body: `Bạn đã được giao một tác vụ ${props.taskType === TaskType.FIX ? ' sửa chứa' : props.taskType === TaskType.RENEW ? ' thay máy' : ' bảo hành'} vào ${format(props.fixerDate, 'dd/MM/yyyy')}`,
        priority: NotificationPriority.MEDIUM,
        subject: props.taskId,
        receiver: {
          id: props.receiverId,
        },
        data: {
          id: props.taskId,
        },
      });
      this.server.emit(props.receiverId, notification);
    },
    [NotificationType.HM_CREATE_RETURN_WARRANTY_TASK]: async (props: {
      receiverId: string;
      fixerDate: Date;
      taskType: TaskType;
      taskId: string;
      senderId: string;
    }) => {
      const notification = await this.notificationsRepository.save({
        type: NotificationType.HM_CREATE_RETURN_WARRANTY_TASK,
        sender: {
          id: props.senderId,
        },
        title: `[${format(props.fixerDate, 'dd/MM/yyyy')}] Tác vụ mới`,
        body: `Bạn đã được giao một tác vụ ${props.taskType === TaskType.FIX ? ' sửa chứa' : props.taskType === TaskType.RENEW ? ' thay máy' : ' bảo hành'} vào ${format(props.fixerDate, 'dd/MM/yyyy')}`,
        priority: NotificationPriority.MEDIUM,
        subject: props.taskId,
        receiver: {
          id: props.receiverId,
        },
        data: {
          id: props.taskId,
        },
      });
      this.server.emit(props.receiverId, notification);
    },
  };

  emit(type: NotificationType) {
    return this.notificationTemplates[type];
  }
}
