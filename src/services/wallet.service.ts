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

export const networkId = (chain: string | undefined) => {
  console.log(chain);
  if (chain === "SN_MAIN") {
    return "mainnet-alpha";
  } else if (chain === "SN_GOERLI") {
    return "goerli-alpha";
  } else {
    return "localhost";
  }
};

export const getExplorerBaseUrl = (chain: string | undefined) => {
  if (chain === "SN_MAIN") {
    return "https://voyager.online";
  } else if (chain === "SN_GOERLI") {
    return "https://goerli.voyager.online";
  }
};

export const waitForTransaction = async (
  accout: AccountInterface,
  hash: string
) => {
  return accout.waitForTransaction(hash);
};
