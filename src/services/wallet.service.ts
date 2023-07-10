import { connect } from "get-starknet";
import {
  AccountInterface,
  constants,
  shortString,
  ProviderInterface,
  provider,
} from "starknet";

import { Network } from "./utils.service";

export const connectWallet = async () => {
  const windowStarknet = await connect({
    include: ["argentX"],
  });
  await windowStarknet?.enable({ starknetVersion: "v4" } as any);
  return windowStarknet;
};

// export const walletAddress = async (): Promise<string | undefined> => {
//   const starknet = getStarknet();
//   if (!starknet?.isConnected) {
//     return;
//   }
//   return starknet.selectedAddress;
// };

export const networkId = async (provider: ProviderInterface) => {
  const chainId = await provider.getChainId();
  console.log(chainId);
  if (chainId === constants.StarknetChainId.SN_MAIN) {
    return "mainnet-alpha";
  } else if (chainId === constants.StarknetChainId.SN_GOERLI) {
    return "goerli-alpha";
  } else {
    return "localhost";
  }
};

export const getExplorerBaseUrl = (): string | undefined => {
  const network = networkId(provider);
  if (network === "mainnet-alpha") {
    return "https://voyager.online";
  } else if (network === "goerli-alpha") {
    return "https://goerli.voyager.online";
  }
};

export const waitForTransaction = async (
  provider: ProviderInterface,
  hash: string
) => {
  return provider.waitForTransaction(hash);
};
