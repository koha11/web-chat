import { connect, io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;

class WebSocketConnection {
  private url = API_HOST + ':' + API_PORT;

  static connection: Socket;

  private constructor() {
    WebSocketConnection.connection = io(this.url, {
      auth: {
        token: Cookies.get('accessToken'),
      },
      // autoConnect: false,
    });
  }

  static getConnection() {
    if (WebSocketConnection.connection == null) new WebSocketConnection();

    return WebSocketConnection.connection;
  }
}

export default WebSocketConnection;
