import USDIA_test from '../../../../tok2tok-contract/contracts/artifacts/USDIA_test.json';
import { useAccount, useSimulateContract, useWriteContract } from 'wagmi';
import { creditsToToken, formatAmount, centsToCredits } from '~/utils';
import useTok2TokContracts from '~/contracts/useTok2TokContracts';

const centsToMint = 1000;
const tokenToMint = BigInt(centsToMint) * BigInt(centsToCredits) * creditsToToken;

const MintButton = () => {
  const { address } = useAccount();
  const { usdia } = useTok2TokContracts();

  const { data } = useSimulateContract({
    address: usdia,
    abi: USDIA_test.abi,
    functionName: 'mint',
    args: [address, tokenToMint],
  });
  const { writeContractAsync } = useWriteContract();

  return (
    <button
      className="'group m-1.5 flex w-full cursor-pointer items-center gap-2 rounded p-2.5 text-sm hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:outline-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600'"
      onClick={async () => {
        const transactionId = await writeContractAsync(data!.request);
        console.log(`##### Mint transaction id=${transactionId}`);
      }}
    >
      Mint {formatAmount(centsToMint * centsToCredits)} USDC
    </button>
  );
};

export default MintButton;
