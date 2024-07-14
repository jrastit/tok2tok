import { RecoilRoot } from 'recoil';
import { DndProvider } from 'react-dnd';
import { RouterProvider } from 'react-router-dom';
import * as RadixToast from '@radix-ui/react-toast';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query-v4';
import { ScreenshotProvider, ThemeProvider, useApiErrorBoundary } from './hooks';
import { ToastProvider } from './Providers';
import Toast from './components/ui/Toast';
import { router } from './routes';

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { WagmiProvider } from 'wagmi';
import { base, baseSepolia, mainnet, arbitrum, goerli, scrollSepolia, celoAlfajores } from 'wagmi/chains';
import { QueryClient as QueryClientV5, QueryClientProvider as QueryClientProviderV5 } from '@tanstack/react-query';
import { defineChain } from 'viem';

// 0. Setup queryClient
const queryClientV5 = new QueryClientV5();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = '128c21914dce46e87e821b14a9e495d0';

// 2. Create wagmiConfig
const metadata = {
  name: 'Tok2Tok',
  description: 'Tok2Tok dApp info',
  url: 'https://tok2tok.ai',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

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

const chains = [base, baseSepolia, mainnet, arbitrum, goerli, scrollSepolia, celoAlfajores, tok2tokChain];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  auth:{
    socials : ['google','discord','x','github'],
  },
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

const App = () => {
  const { setError } = useApiErrorBoundary();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error?.response?.status === 401) {
          setError(error);
        }
      },
    }),
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProviderV5 client={queryClientV5}>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <ThemeProvider>
              <RadixToast.Provider>
                <ToastProvider>
                  <DndProvider backend={HTML5Backend}>
                    <RouterProvider router={router} />
                    <Toast />
                    <RadixToast.Viewport className="pointer-events-none fixed inset-0 z-[1000] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />
                  </DndProvider>
                </ToastProvider>
              </RadixToast.Provider>
            </ThemeProvider>
          </RecoilRoot>
        </QueryClientProvider>
      </QueryClientProviderV5>
    </WagmiProvider>
  );
};

export default () => (
  <ScreenshotProvider>
    <App/>
  </ScreenshotProvider>
);
