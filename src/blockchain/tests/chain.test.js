const Chain = require('../chain');
const Block = require('../block');

const FAKE_DATA = 'foo-bar';

describe('Chain', () => {
  let chain;
  let remoteChain;
  beforeEach(() => {
    chain = new Chain();
    remoteChain = new Chain();
  });

  it('new chain should have gensis block', () => {
    expect(chain.lastBlock.prevHash).toBe(Block.genesis().prevHash);
  });

  it('should add a new block', () => {
    chain.addBlock(FAKE_DATA);
    expect(chain.lastBlock.data).toBe(FAKE_DATA);
  });

  it('should correctly save ref to prev hash', () => {
    chain.addBlock(FAKE_DATA);
    expect(chain.firstBlock.hash).toBe(chain.lastBlock.prevHash);
  });

  it('validates a valid chain', () => {
    remoteChain.addBlock(FAKE_DATA);
    expect(chain.isValidChain(remoteChain)).toBe(true);
  });

  it('invalidates chain with corrupt genesis block', () => {
    remoteChain.firstBlock.data = 'corrupted';
    expect(chain.isValidChain(remoteChain)).toBe(false);
  });

  it('invalidates chain with corrupt block', () => {
    remoteChain.addBlock(FAKE_DATA);
    remoteChain.lastBlock.data = 'corrupted';
    expect(chain.isValidChain(remoteChain)).toBe(false);
  });

  it('can replace valid chain', () => {
    remoteChain.addBlock(FAKE_DATA);
    remoteChain.addBlock(FAKE_DATA);
    expect(chain.replaceChain(remoteChain)).toBe(true);
    expect(chain.chain).toEqual(remoteChain.chain);
  });

  it('fails to replace invalid chain', () => {
    remoteChain.addBlock(FAKE_DATA);
    remoteChain.lastBlock.data = 'corrupted';
    expect(chain.replaceChain(remoteChain)).toBe(false);
    expect(chain.chain).not.toEqual(remoteChain.chain);
  });

  it('fails to replace shorter chain', () => {
    chain.addBlock(FAKE_DATA);
    chain.addBlock(FAKE_DATA);
    remoteChain.addBlock(FAKE_DATA);
    expect(chain.replaceChain(remoteChain)).toBe(false);
    expect(chain.chain).not.toEqual(remoteChain.chain);
  });
});
