import { useOutletContext } from 'react-router-dom';
import { useAuthContext } from '~/hooks/AuthContext';
import type { TLoginLayoutContext } from '~/common';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import { getLoginError } from '~/utils';
import { useLocalize } from '~/hooks';
import LoginForm from './LoginForm';
import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';

function Login() {
  const authContext = useAuthContext();
  const { signMessage } = useSignMessage();
  const localize = useLocalize();
  const { error, setError, login } = useAuthContext();
  const { startupConfig } = useOutletContext<TLoginLayoutContext>();

  const { address } = useAccount() ?? {};
  const [nonce, setNonce] = useState<string>();
  const [pending, setPending] = useState(false);
  const [signature, setSignature] = useState<string>();

  useEffect(() => {
    if (address && !nonce) {
      if (!pending) {
        setPending(true);
        console.log('### Requesting nonce');
        (async () => {
          const response = await fetch('/api/auth/login-wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'nonce', address }),
          });
          const { nonce } = await response.json();
          setNonce(nonce);
          setPending(false);
        })();
      }
    } else if (address && nonce && !signature) {
      if (!pending) {
        setPending(true);
        console.log('### Requesting signature');
        signMessage({ message: nonce }, {
          onSuccess: (data) => {
            setSignature(data);
            setPending(false);
          },
        });
      }
    } else if (address && nonce && signature) {
      if (!pending) {
        setPending(true);
        console.log('### Requesting auth token');
        (async () => {
          const response = await fetch('/api/auth/login-wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: 'callback', address, nonce, signature }),
          });
          const authData = await response.json();
          authContext.authUser(authData);
        })();
      }
    }
  }, [nonce, address, pending, authContext, signMessage, signature]);

  return (
    <>
      {error && <ErrorMessage>{localize(getLoginError(error))}</ErrorMessage>}
      <div className="text-center">
        <w3m-button/>
      </div>
      {startupConfig?.emailLoginEnabled && (
        <LoginForm
          onSubmit={login}
          startupConfig={startupConfig}
          error={error}
          setError={setError}
        />
      )}
      {startupConfig?.registrationEnabled && (
        <p className="my-4 text-center text-sm font-light text-gray-700 dark:text-white">
          {' '}
          {localize('com_auth_no_account')}{' '}
          <a href="/register" className="p-1 text-green-500">
            {localize('com_auth_sign_up')}
          </a>
        </p>
      )}
    </>
  );
}

export default Login;
