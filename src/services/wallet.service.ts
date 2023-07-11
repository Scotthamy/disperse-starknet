import { connect } from "get-starknet";
import { AccountInterface } from "starknet";

export const connectWallet = async () => {
  const windowStarknet = await connect({
    include: ["argentX", "braavos"],
  });
  await windowStarknet?.enable({ starknetVersion: "v5" } as any);
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
    return "https://starkscan.co/";
  } else if (chain === "SN_GOERLI") {
    return "https://testnet.starkscan.co/";
  }
};

export const waitForTransaction = async (
  accout: AccountInterface,
  hash: string
) => {
  return accout.waitForTransaction(hash);
};
