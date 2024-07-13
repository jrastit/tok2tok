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
import { mainnet, arbitrum, goerli, scrollSepolia, celoAlfajores } from 'wagmi/chains';
import { QueryClient as QueryClientV5, QueryClientProvider as QueryClientProviderV5 } from '@tanstack/react-query';

// 0. Setup queryClient
const queryClientV5 = new QueryClientV5();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = 'adad6ddb068edeb3c80dccb1bf3e4673';

// 2. Create wagmiConfig
const metadata = {
  name: 'Tok2Tok',
  description: 'Tok2Tok',
  url: 'https://tok2tok.ai',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, arbitrum, goerli, scrollSepolia, celoAlfajores];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
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
