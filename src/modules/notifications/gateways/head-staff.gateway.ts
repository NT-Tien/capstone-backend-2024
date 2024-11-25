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

  emit(type: NotificationType) {
    switch (type) {
      case NotificationType.HD_CREATE_REQUEST: {
        return async (props: {
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
            receiver: {
              id: Accounts.HEAD_MAINTENANCE,
            },
            data: {
              areaName: props.areaName,
              requestId: props.requestId,
            },
          });
          this.server.emit(Accounts.HEAD_MAINTENANCE, notification);
        };
      }
    }
  }
}
