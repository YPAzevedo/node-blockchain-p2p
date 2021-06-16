const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5555;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  connectSocket(socket) {
    this.sockets.push(socket);

    this.messageHandler(socket);

    this.sendChain(socket);

    console.log(
      `✅ Socket connected at ${socket._url || 'N/A'} you have ${
        this.sockets.length
      } listening`
    );
  }

  connectToPeers() {
    peers.forEach((peerAddress) => {
      const socket = new WebSocket(peerAddress);

      socket.on('open', () => this.connectSocket(socket));
      socket.on('close', () =>
        console.log(`❌ Closed connection for peer ${peerAddress}`)
      );
    });
  }

  messageHandler(socket) {
    socket.on('message', (message) => {
      const chain = JSON.parse(message);

      this.blockchain.replaceChain(
        this.blockchain.getBlockDataFromChain(chain)
      );
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains() {
    this.sockets.forEach((socket) => this.sendChain(socket));
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });

    this.connectToPeers();

    server.on('connection', (socket) => this.connectSocket(socket));
    console.log(`🍐 Listening to p2p connetction on: ${P2P_PORT}`);
  }
}

module.exports = P2PServer;
