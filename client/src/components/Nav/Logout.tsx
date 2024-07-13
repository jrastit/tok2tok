import { forwardRef } from 'react';
import { LogOutIcon } from '../svg';
import { useAuthContext } from '~/hooks/AuthContext';
import { useLocalize } from '~/hooks';
import { useDisconnect } from 'wagmi';

const Logout = forwardRef(() => {
  const { logout } = useAuthContext();
  const localize = useLocalize();
  const { disconnect } = useDisconnect();

  return (
    <button
      className="group group flex w-full cursor-pointer items-center gap-2 rounded p-2.5 text-sm transition-colors duration-200 hover:bg-gray-500/10 focus:ring-0 dark:text-white dark:hover:bg-gray-600"
      onClick={() => {
        disconnect();
        logout();
      }}
    >
      <LogOutIcon/>
      {localize('com_nav_log_out')}
    </button>
  );
});

export default Logout;
