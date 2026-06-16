import {
  WebSocketGateway as WsGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  userRole?: string;
}

@WsGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/ws',
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private adminConnections = new Map<number, AuthenticatedSocket>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token as string);
      client.userId = payload.id;
      client.userRole = payload.type;

      if (client.userRole === 'admin' && client.userId) {
        this.adminConnections.set(client.userId, client);
        this.logger.log(`Admin ${client.userId} connected`);
      }

      client.emit('connected', { message: '连接成功' });
    } catch (error) {
      this.logger.error('Connection authentication failed');
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId && client.userRole === 'admin') {
      this.adminConnections.delete(client.userId);
      this.logger.log(`Admin ${client.userId} disconnected`);
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket) {
    client.emit('pong', { timestamp: Date.now() });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { room: string },
  ) {
    client.join(data.room);
    this.logger.log(`Client ${client.userId} joined room: ${data.room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { room: string },
  ) {
    client.leave(data.room);
    this.logger.log(`Client ${client.userId} left room: ${data.room}`);
  }

  sendToAdmin(userId: number, event: string, data: any) {
    const client = this.adminConnections.get(userId);
    if (client) {
      client.emit(event, data);
    }
  }

  broadcastToAdmins(event: string, data: any) {
    this.adminConnections.forEach((client) => {
      client.emit(event, data);
    });
  }

  sendOrderNotification(orderData: {
    orderId: string;
    type: string;
    message: string;
    amount?: number;
  }) {
    this.broadcastToAdmins('order:notification', {
      ...orderData,
      timestamp: Date.now(),
    });
  }

  sendSystemNotification(data: {
    title: string;
    content: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }) {
    this.broadcastToAdmins('system:notification', {
      ...data,
      timestamp: Date.now(),
    });
  }
}
