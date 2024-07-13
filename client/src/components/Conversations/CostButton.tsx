import { ReactElement, useEffect } from 'react';
import { cn } from '~/utils';
import { useGetConversationByIdQuery } from 'librechat-data-provider/react-query';

interface CostButtonProps {
  conversationId: string;
  className?: string;
}

export default function CostButton({
  conversationId,
  className = '',
}: CostButtonProps): ReactElement {
  const { data, refetch } = useGetConversationByIdQuery(conversationId);

  useEffect(() => {
    refetch();
  });

  return (
    <div
      className={cn(
        'group m-1.5 flex w-full cursor-pointer items-center gap-2 rounded p-2.5 text-sm radix-disabled:pointer-events-none radix-disabled:opacity-50 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600',
        className,
      )}
    >
      Cost: {((data?.cost ?? 0) / 1000000).toFixed(3)} USDC
    </div>
  );
}