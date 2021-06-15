const Block = require("./blockchain/block");

const block = new Block(Block.genesis().hash, "foo-bar");
