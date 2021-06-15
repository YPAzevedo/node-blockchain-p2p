const Chain = require("./blockchain/chain");
const P2PServer = require("./p2p/server");

const fastify = require("fastify")({ logger: true });

const PORT = process.env.PORT || 3333;

const blockchain = new Chain();
const p2pServer = new P2PServer(blockchain);

fastify.get("/blocks", async (request, reply) => {
  return blockchain.chain;
});

fastify.post("/mine", async (request, reply) => {
  blockchain.addBlock(request.body.data);
  p2pServer.syncChains();
  return blockchain.chain;
});

const startServer = async () => {
  try {
    await fastify.listen(PORT);
    console.log(`🚀 Running on PORT:${PORT}`);
    p2pServer.listen();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

module.exports = { startServer };
