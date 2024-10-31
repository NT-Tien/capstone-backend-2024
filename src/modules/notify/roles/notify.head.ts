import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RequestEntity } from 'src/entities/request.entity';
import { HeadGuard } from 'src/modules/auth/guards/head.guard';
import { HeadChannel } from '../channels/head.channel';
import { HeadNotifySevice } from '../services/head.notify.service';
import { AccountService } from 'src/modules/_headstaff/account/account.service';

@UseGuards(HeadGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'socket/head',
})
export class HeadGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly headNotifyService: HeadNotifySevice,
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

  async emit_request_approved(request: RequestEntity, senderId: string) {
    const sender = await this.accountService.getOne(senderId);
    const response = await this.headNotifyService.requestApproved(
      request,
      sender,
      request.requester,
      HeadChannel.REQUEST_APPROVED,
    );
    this.server.emit(request.requester.id, response);
  }

  async emit_request_rejected(request: RequestEntity, senderId: string) {
    const sender = await this.accountService.getOne(senderId);
    const response = await this.headNotifyService.requestRejected(
      request,
      sender,
      request.requester,
      HeadChannel.REQUEST_REJECTED,
    );
    this.server.emit(request.requester.id, response);
  }
}
