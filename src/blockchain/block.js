const crypto = require("crypto");

class Block {
  constructor(prevHash, data) {
    this.prevHash = prevHash;
    this.data = data;
    this.timestamp = Date.now();
    this.hash = Block.hashFromData(this.toString());
  }

  toString() {
    return JSON.stringify({
      prevHash: this.prevHash,
      data: this.data,
      timestamp: this.timestamp,
    });
  }

  static hashFromData(block) {
    const hash = crypto.createHash("SHA256");
    hash.update(block.toString());
    const hexHash = hash.digest("hex");
    return hexHash;
  }

  static genesis() {
    return new Block("0xGENESIS", null);
  }

  static mine(prevBlock, data) {
    //lastBlock can come from chain
    return new Block(prevBlock.hash, data);
  }
}

module.exports = Block;
