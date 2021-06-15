const Block = require("../block");
const { DIFICULTY } = require("../../blockchain.config");

describe("Block", () => {
  let data, genesis, block;

  beforeEach(() => {
    data = "foo-bar";
    genesis = Block.genesis();
    block = Block.mine(genesis, data);
  });

  it("set the right data on block", () => {
    expect(block.data).toBe(data);
  });

  it("last hash to match new block prev hash", () => {
    expect(block.prevHash).toBe(genesis.hash);
  });

  it("hash and hashFromData for the same block match", () => {
    expect(block.hash).toBe(Block.hashFromData(block));
  });

  it("generates a hash with start zeros that match dificulty", () => {
    expect(block.hash.substring(0, DIFICULTY)).toBe("0".repeat(DIFICULTY));
  });
});
