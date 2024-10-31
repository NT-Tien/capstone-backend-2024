import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Role } from 'src/entities/account.entity';
import { RequestEntity } from 'src/entities/request.entity';
import { HeadStaffGuard } from 'src/modules/auth/guards/headstaff.guard';
import { HeadStaffNotifyService } from '../services/head-staff.notify.service';
import { HeadStaffChannel } from '../channels/head-staff.channel';
import { TaskEntity } from 'src/entities/task.entity';

@UseGuards(HeadStaffGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: `socket/${Role.headstaff.toString()}`,
})
export class HeadStaffGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly notifyService: HeadStaffNotifyService) {} // add servies

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

  async emit_request_create(request: RequestEntity, senderId: string) {
    const headStaff = await this.notifyService.getHeadStaffAccount();
    const sender = await this.notifyService.getAccountById(senderId);
    const notification = await this.notifyService.requestCreated(
      request,
      sender,
      headStaff,
      HeadStaffChannel.REQUEST_CREATED
    );
    this.server.emit(headStaff.id, notification);
  }

  async emit_task_started(task: TaskEntity, senderId: string) {
    const headStaff = await this.notifyService.getHeadStaffAccount();
    const sender = await this.notifyService.getAccountById(senderId);
    const notification = await this.notifyService.taskStarted(
      task,
      sender,
      headStaff,
      HeadStaffChannel.TASK_STARTED
    )
    this.server.emit(headStaff.id, notification);
  }
}
