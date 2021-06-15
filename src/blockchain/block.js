const crypto = require("crypto");

class Block {
  constructor(prevHash, data) {
    this.prevHash = prevHash;
    this.data = data;
    this.timestamp = prevHash === "0xGENESIS" ? "0xGENESIS" : Date.now();
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
    const hash = crypto.createHash("SHA256");
    hash.update(Block.serializedBlockToString(block));
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
