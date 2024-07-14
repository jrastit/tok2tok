docker pull availrishabh/avail-nitro-node-dev:v2.3.1
git clone https://github.com/availproject/nitro-contracts.git
cd nitro-contracts
git checkout avail-develop-v2.3.1
yarn install
yarn build
