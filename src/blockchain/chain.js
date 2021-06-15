const Block = require("./block");

class Chain {
  constructor() {
    // Created a chain with a genesis block.
    this.chain = [Block.genesis()];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  get firstBlock() {
    return this.chain[0];
  }

  addBlock(data) {
    const block = Block.mine(this.lastBlock, data);
    this.chain.push(block);
    return block;
  }
  // Validates chain is not corrupted.
  isValidChain(remoteChainInstance) {
    const remoteChain = remoteChainInstance.chain;
    const currentChainFirstBlock = JSON.stringify(this.firstBlock);
    const incomingChainFirstBlock = JSON.stringify(
      remoteChainInstance.firstBlock
    );
    // Make sure genessis blocks match
    if (currentChainFirstBlock !== incomingChainFirstBlock) return false;
    // Check every blocks hash and data.
    for (let i = 1; i < remoteChain.length; i++) {
      const block = remoteChain[i];
      const prevBlock = remoteChain[i - 1];

      if (
        block.prevHash !== prevBlock.hash ||
        block.hash !== Block.hashFromData(block)
      ) {
        return false;
      }
    }

    return true;
  }
  // Replace chain for consistency for all chains in the network
  replaceChain(chainToReplace) {
    if (chainToReplace.chain.length <= this.chain.length) {
      console.log("Recieved chain is not longer then current chain.");
      return false;
    }
    if (!this.isValidChain(chainToReplace)) {
      console.log("Recieved chain is corrupted.");
      return false;
    }
    this.chain = chainToReplace.chain;
    console.log("Chain replaced.");
    return true;
  }

  getBlockDataFromChain(chain) {
    return {
      chain,
      firstBlock: chain[0],
      lastBlock: chain[chain.length - 1],
    };
  }
}

module.exports = Chain;
