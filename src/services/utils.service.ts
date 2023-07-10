import { BigNumber, utils } from "ethers";

export const dispeseAddessByNetwork = {
  "goerli-alpha":
    "0x01cddfc8b081342199e75413caccff64f2ff7f15954267ad95152fdacf66d25b",
  "mainnet-alpha":
    "0x00ecbd1107cdd47d0762908f6933b75d5b96896893dbf20c399c3808410ce940",
};

export const dispeseUrl = {
  "goerli-alpha": "https://goerli.voyager.online/",
  "mainnet-alpha": "https://voyager.online/",
};

export type PublicNetwork =
  | keyof typeof dispeseAddessByNetwork
  | keyof typeof dispeseUrl;

export type Network = PublicNetwork | "localhost";

export const getDisperseAddress = (network: PublicNetwork) =>
  dispeseAddessByNetwork[network];

export const getDisperseUrl = (network: PublicNetwork) =>
  dispeseUrl[network] + dispeseAddessByNetwork[network];

export const parseText = (textValue: string) => {
  const lines = textValue.split("\n");
  let updatedRecivers: string[] = [];
  let updatedAmounts: string[] = [];
  let updatedAmounts_number: BigNumber[] = [];

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
        updatedAmounts.push(utils.parseUnits(value, "ether").toString());
        updatedAmounts_number.push(utils.parseUnits(value, "ether"));
      }
    }
  });

  return { updatedRecivers, updatedAmounts, updatedAmounts_number };
};
