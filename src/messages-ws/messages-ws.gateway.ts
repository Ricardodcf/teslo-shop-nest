import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}


  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    // console.log({token, payload});
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClientStr());
    // console.log('client connect', client.id);
    // console.log({conectados: this.messagesWsService.getConnectedClient()});
  }


  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClientStr());
    // console.log('client disconnect', client.id);
    // console.log({conectados: this.messagesWsService.getConnectedClient()});
  }


  @SubscribeMessage('message-form-client')
  onMessageFormClient(client: Socket, payload: NewMessageDto) {
    // console.log(client.id, payload);

    //! Emite unicamente al cliente
    // client.emit('message-form-server', {
    //   fullName: 'Soy Yo!!',
    //   message: payload.message || 'no-message'
    // });

    //! Emitir a todos MENOS , al cliente inicial
    // client.broadcast.emit('message-form-server', {
    //   fullName: 'Soy Yo!!',
    //   message: payload.message || 'no-message'
    // });

    //! Emitir a TODOS
    this.wss.emit('message-form-server', {
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no-message'
    });
  }
}
