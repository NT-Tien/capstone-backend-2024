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
import { StaffGuard } from 'src/modules/auth/guards/staff.guard';

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

  constructor() {} // add servies

  handleConnection(client: Socket, ...args: any[]) {
    var ip =
      client.handshake.headers['x-forwarded-for'] || client.handshake.address;
    var token = client.handshake.headers['x-auth-token'];
    console.log(ip, token, 'connected at', new Date().toLocaleString());
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('new-payment', { message: 'Fuck' });
    setInterval(() => {
      this.server.emit('new-payment', { message: 'Hello from server' });
      console.log('send message to client');
    }, 1000);
  }

  afterInit(server: any) {
    console.log('init socket staff');
    ('init');
  }

  handleDisconnect(client: any) {
    var ip =
      client.handshake.headers['x-forwarded-for'] || client.handshake.address;
    var token = client.handshake.headers['x-auth-token'];
    console.log(ip, token, 'disconnected at', new Date().toLocaleString());
  }
}
