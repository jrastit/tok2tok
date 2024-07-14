import USDIA_test from '../../../../tok2tok-contract/contracts/artifacts/USDIA_test.json';
import { useAccount, useSimulateContract, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { centsToCredits, creditsToToken, formatAmount } from '~/utils';
import useTok2TokContracts from '~/contracts/useTok2TokContracts';

const centsToDeposit = 100;
const tokenToDeposit = BigInt(centsToDeposit) * BigInt(centsToCredits) * creditsToToken;

const DepositButton = () => {
  const { address } = useAccount();
  const [approved, setApproved] = useState(false);
  const { usdia, tok2tok } = useTok2TokContracts();

  const { data: dataApprove } = useSimulateContract({
    address: usdia,
    abi: USDIA_test.abi,
    functionName: 'approve',
    args: [address, tokenToDeposit],
  });
  const { writeContractAsync: writeApprove } = useWriteContract();

  const { data: dataTransfer, refetch } = useSimulateContract({
    address: usdia,
    abi: USDIA_test.abi,
    functionName: 'transfer',
    args: [tok2tok, tokenToDeposit],
  });
  const { writeContractAsync: writeTransfer } = useWriteContract();

  return (
    <button
      className="'group m-1.5 flex w-full cursor-pointer items-center gap-2 rounded p-2.5 text-sm hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:outline-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600'"
      onClick={async () => {
        if (!approved) {
          console.log('####### Approving tx...');
          const approvedTxId = await writeApprove(dataApprove!.request);
          setApproved(true);
          console.log(`####### Approved tx id=${approvedTxId}`);
          refetch();
        }
        if (dataTransfer?.request) {
          const transferTxId = await writeTransfer(dataTransfer.request);
          console.log(`####### Transfer tx id=${transferTxId}`);
          setApproved(false);
        }
      }}
    >
      Deposit {formatAmount(centsToDeposit * centsToCredits)} USDC
    </button>
  );
};

export default DepositButton;
