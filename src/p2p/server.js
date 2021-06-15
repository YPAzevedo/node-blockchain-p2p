const WebSocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5555;

const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

class P2PServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  connectSocket(socket) {
    console.log("Socket connected.");

    this.sockets.push(socket);

    this.messgeHandler(socket);

    socket.send(JSON.stringify(this.blockchain.chain));
  }

  connectToPeers() {
    peers.forEach((peerAddress) => {
      const socket = new WebSocket(peerAddress);

      console.log(peerAddress);

      socket.on("open", () => this.connectSocket(socket));
    });
  }

  messgeHandler(socket) {
    socket.on("message", (message) => {
      const data = JSON.parse(message);

      console.log(data);
    });
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });

    this.connectToPeers();

    server.on("connection", (socket) => this.connectSocket(socket));
    console.log(`🍐 Listening to p2p connetction on: ${P2P_PORT}`);
  }
}

module.exports = P2PServer;
