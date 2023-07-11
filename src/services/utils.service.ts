import { BigNumber, utils } from "ethers";
import { AccountInterface, Contract, Abi } from "starknet";
import abi from "../abi/erc20Abi.json";
export const dispeseAddessByNetwork = {
  SN_GOERLI:
    "0x01cddfc8b081342199e75413caccff64f2ff7f15954267ad95152fdacf66d25b",
  SN_MAIN: "0x00ecbd1107cdd47d0762908f6933b75d5b96896893dbf20c399c3808410ce940",
};

export const dispeseUrl = {
  SN_GOERLI: "https://testnet.starkscan.co/contract/",
  SN_MAIN: "https://starkscan.co/contract/",
};

export type PublicNetwork =
  | keyof typeof dispeseAddessByNetwork
  | keyof typeof dispeseUrl;

export type Network = PublicNetwork | "localhost";

export const getDisperseAddress = (network: PublicNetwork) =>
  dispeseAddessByNetwork[network];

export const getDisperseUrl = (network: PublicNetwork) =>
  dispeseUrl[network] + dispeseAddessByNetwork[network];

export const parseText = async (
  textValue: string,
  account: AccountInterface,
  erc20Address: string
) => {
  const lines = textValue.split("\n");
  let updatedRecivers: string[] = [];
  let updatedAmounts: string[] = [];
  let updatedAmounts_number: BigNumber[] = [];

  const tokenContract = new Contract(abi, erc20Address, account);
  const decimalsObject = await tokenContract.decimals();
  let decimals = decimalsObject.decimals;
  lines.map((line) => {
    if (
      line.includes(" ") ||
      line.includes(",") ||
      line.includes("=") ||
      line.includes("\t")
    ) {
      const [address, value] = line.split(/[,= \t]+/);
      if (address && value) {
        updatedRecivers.push(address);
        updatedAmounts.push(utils.parseUnits(value, decimals).toString());
        updatedAmounts_number.push(utils.parseUnits(value, decimals));
      }
    }
  });

  return { updatedRecivers, updatedAmounts, updatedAmounts_number };
};
