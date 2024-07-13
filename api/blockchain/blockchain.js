const { createPublicClient, http } = require('viem');
const { scrollSepolia } = require('viem/chains');
const { findUser, countUsers, createUser } = require('~/models');
const { SystemRoles } = require('librechat-data-provider');
const { Transaction } = require('~/models/Transaction');

const publicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
});

const listenBlockchain = () => {
  console.log(`#### watching events 1.... ${JSON.stringify(scrollSepolia.rpcUrls)}`);
  const unwatch = publicClient.watchEvent({
    address: '0x0e87fe746789dab39b98a3e8c44d38665ed55952',
    onLogs: (logs) => {
      logs.forEach(async ({ topics, data }) => {
        if (
          topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
          &&
          topics[2] === '0x000000000000000000000000169f1c2cfb68c84f9f6a68b3e7267c95d1cf1d83'
        ) {
          try {
            const address = `0x${topics[1].substring(26)}`;
            const amount = Number(BigInt(data) / 1000000000000n);
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
        }
      });
    },
  });
  console.log('#### watching events 2....');
  return unwatch;
};

module.exports = { listenBlockchain };
