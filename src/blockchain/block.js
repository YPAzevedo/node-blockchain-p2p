const crypto = require('crypto');
const { DIFICULTY } = require('../blockchain.config');

class Block {
  constructor(prevHash, data, nonce) {
    this.prevHash = prevHash;
    this.data = data;
    this.timestamp = prevHash === '0xGENESIS' ? '0xGENESIS' : Date.now();
    this.nonce = nonce;
    this.hash = Block.hashFromData(this);
  }

  static serializedBlockToString(block) {
    return JSON.stringify({
      prevHash: block.prevHash,
      data: block.data,
      timestamp: block.timestamp,
    });
  }

  static hashFromData(block) {
    const hash = crypto.createHash('SHA256');
    hash.update(Block.serializedBlockToString(block));
    const hexHash = hash.digest('hex');
    return hexHash;
  }

  static genesis() {
    return new Block('0xGENESIS', null, 0);
  }

  static mine(prevBlock, data) {
    let nonce = 0;
    let block;
    // Proof of work
    do {
      nonce++;
      block = new Block(prevBlock.hash, data, nonce);
    } while (block.hash.substring(0, DIFICULTY) !== '0'.repeat(DIFICULTY));

    return block;
  }
}

module.exports = Block;
