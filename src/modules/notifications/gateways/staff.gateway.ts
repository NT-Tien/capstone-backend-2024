import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Role } from 'src/entities/account.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { AccountService } from 'src/modules/_headstaff/account/account.service';
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';

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

  constructor() {}

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
}
