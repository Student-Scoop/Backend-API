import { Socket } from 'socket.io';

export interface SocketExtended extends Socket {
	test: string;
}
