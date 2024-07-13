const { setAuthTokens } = require('~/server/services/AuthService');
const { logger } = require('~/config');
const { v4: uuid } = require('uuid');
const { createUser, findUser, countUsers } = require('~/models');
const { SystemRoles } = require('librechat-data-provider');

const nonces = {};

const noncesCleanup = () => {
  const now = Date.now();
  Object.entries(nonces).forEach(([address, { maxDate }]) => {
    if (now > maxDate) {
      delete nonces[address];
    }
  });
};

const loginWithWalletController = async (req, res) => {
  try {
    noncesCleanup();
    const { type, address: addressRaw } = req.body;
    const address = addressRaw.toLowerCase();
    if (type === 'nonce') {
      const nonce = `tok2tok.ai validation message: address=${address} nonce=${uuid()}`;
      nonces[address] = { nonce, maxDate: Date.now() + (5 * 60 * 1000) };
      return res.status(200).send({ nonce });
    } else if (type === 'callback') {
      const { nonce, signature } = req.body;
      if (nonce === nonces[address].nonce) {
        // TODO check signature
        console.log(`###### Received signature ${signature}`);
        delete nonces[address];

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

        const token = await setAuthTokens(user._id, res);

        return res.status(200).send({ token, user });

      }
    }

    return res.status(400).json({ message: 'Invalid credentials' });
  } catch (err) {
    logger.error('[loginController]', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  loginWithWalletController,
};
