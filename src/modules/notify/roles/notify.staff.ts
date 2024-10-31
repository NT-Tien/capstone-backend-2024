import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TaskEntity } from 'src/entities/task.entity';
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';
import { StaffNotifyService } from '../services/staff.notify.service';
import { AccountService } from 'src/modules/_headstaff/account/account.service';
import { StaffChannel } from '../channels/staff.channel';

@UseGuards(StaffGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'socket/staff',
})
export class StaffGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly staffNotifyService: StaffNotifyService,
    private readonly accountService: AccountService,
  ) {} // add servies

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

  async emit_task_assigned(task: TaskEntity, senderId: string, receiverId: string) {
    const sender = await this.accountService.getOne(senderId);
    const receiver = await this.accountService.getOne(receiverId);
    const response = await this.staffNotifyService.taskAssigned(task, sender, receiver, StaffChannel.TASK_ASSIGNED);
    this.server.emit(receiverId, response)
  }
}
