const { createPublicClient, http, defineChain } = require('viem');
const { scrollSepolia } = require('viem/chains');
const { findUser, countUsers, createUser } = require('~/models');
const { SystemRoles } = require('librechat-data-provider');
const { Transaction } = require('~/models/Transaction');

const tok2tokChain = /*#__PURE__*/ defineChain({
  id: 4251,
  name: 'Tok2Tok Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://tok2tok.ai:8449'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Scrollscan',
      url: 'http://tok2tok.ai:8449:1180',
      apiUrl: 'http://tok2tok.ai:8449:1180/api',
    },
  },
  testnet: true,
});

const scrollPublicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
});

const tok2tokClient = createPublicClient({
  chain: tok2tokChain,
  transport: http(),
});

const watchers = [
  {
    client: scrollPublicClient,
    usdia: '0x0e87fe746789dab39b98a3e8c44d38665ed55952',
    tok2tok: '0x000000000000000000000000169f1c2cfb68c84f9f6a68b3e7267c95d1cf1d83',
  },
  {
    client: tok2tokClient,
    usdia: '0xD503310a89F88255C2692c5D52091ba1D5DD0fa7'.toLowerCase(),
    tok2tok: '0x00000000000000000000000003799eb0c7C593F6125186d57D87c439be023BA0'.toLowerCase(),
  },
];

const processEvent = async (address, amount) => {
  try {
    console.log(`#### new Tok2Tok deposit! from=${address} amount=${amount}`);

    let user = await findUser({ walletAddress: address });
    if (!user) {
      //determine if this is the first registered user (not counting anonymous_user)
      const isFirstRegisteredUser = (await countUsers()) === 0;

      const newUserData = {
        provider: 'local',
        email: `${address}@nodomain.eth`,
        name: address,
        avatar: null,
        role: isFirstRegisteredUser ? SystemRoles.ADMIN : SystemRoles.USER,
        walletAddress: address,
      };

      user = await createUser(newUserData, false, true);
    }

    await Transaction.create({
      user: user._id,
      tokenType: 'credits',
      context: 'admin',
      rawAmount: +amount,
    });
    console.log(`##### Balance incremented for user=${user._id}`);
  } catch (e) {
    console.error(e);
  }
};

const listenBlockchain = () => {
  watchers.forEach(({ client, usdia, tok2tok }) => {
    console.log(`#### watching events.... ${JSON.stringify(client.chain.rpcUrls)}`);
    client.watchEvent({
      address: usdia,
      onLogs: (logs) => {
        logs.forEach(async ({ topics, data }) => {
          if (
            topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
            &&
            topics[2] === tok2tok
          ) {
            const address = `0x${topics[1].substring(26)}`;
            const amount = Number(BigInt(data) / 1000000000000n);
            processEvent(address, amount);
          }
        });
      },
    });
  });
};

module.exports = { listenBlockchain };
