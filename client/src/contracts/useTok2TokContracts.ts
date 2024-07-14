import { useChainId } from 'wagmi';

export const contractsByChain: Record<number, { usdia: `0x${string}`, tok2tok: `0x${string}` }> = {
  534351: {
    usdia: '0x0e87Fe746789dAb39B98a3E8c44D38665Ed55952'.toLowerCase() as `0x${string}`,
    tok2tok: '0x169F1C2Cfb68C84f9f6a68b3E7267C95d1CF1d83'.toLowerCase() as `0x${string}`,
  },
  4251: {
    usdia: '0xD503310a89F88255C2692c5D52091ba1D5DD0fa7'.toLowerCase() as `0x${string}`,
    tok2tok: '0x03799eb0c7C593F6125186d57D87c439be023BA0'.toLowerCase() as `0x${string}`,
  },
};

const useTok2TokContracts: () => { usdia: `0x${string}`, tok2tok: `0x${string}` } = () => {
  const chainId = useChainId();
  const result = contractsByChain[chainId];
  if (!result) {
    throw Error(`Unknown chainId=${chainId}`);
  }
  return result;
};

export default useTok2TokContracts;
