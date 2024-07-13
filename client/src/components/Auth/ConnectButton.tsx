import React from 'react';
import { useWeb3Modal } from '@web3modal/scaffold-react';

const ConnectButton = () => {
  const { open } = useWeb3Modal();

  return <button
    onClick={() => {
      open();
    }}
    style={{
      width: '160px',
      height: '40px',

      background: '#5FA393',
      borderRadius: '10px',
    }}
  >
    <span
      style={{
        color: '#FFFFFF',
      }}
    >
      Connect Wallet
    </span>
  </button>;
};

export default ConnectButton;