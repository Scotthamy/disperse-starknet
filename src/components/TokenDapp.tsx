import { FC, useEffect, useState } from "react";
import { AccountInterface, cairo, CallData, ProviderInterface } from "starknet";
import { truncateHex } from "../services/address.service";
import { parseText, getDisperseAddress } from "../services/utils.service";
import {
  getExplorerBaseUrl,
  networkId,
  waitForTransaction,
} from "../services/wallet.service";
import styles from "../styles/Home.module.css";

type Status = "idle" | "approve" | "pending" | "success" | "failure";

export const TokenDapp: FC<{
  provider: ProviderInterface;
  account: AccountInterface;
}> = ({ provider, account }) => {
  const [erc20Address, seterc20Address] = useState("");
  const [transferTo, setTransferTo] = useState("");

  const [lastTransactionHash, setLastTransactionHash] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<Status>("idle");
  const [transactionError, setTransactionError] = useState("");

  const buttonsDisabled = ["approve", "pending"].includes(transactionStatus);

  useEffect(() => {
    (async () => {
      if (lastTransactionHash && transactionStatus === "pending") {
        setTransactionError("");
        try {
          await waitForTransaction(provider, lastTransactionHash);
          setTransactionStatus("success");
        } catch (error: any) {
          setTransactionStatus("failure");
          let message = error ? `${error}` : "No further details";
          if (error?.response) {
            message = JSON.stringify(error.response, null, 2);
          }
          setTransactionError(message);
        }
      }
    })();
  }, [transactionStatus, lastTransactionHash]);

  const network = networkId(provider);
  if (network !== "goerli-alpha" && network !== "mainnet-alpha") {
    return (
      <>
        <p>Please switch to Starknet Mainnet or Testnet.</p>
      </>
    );
  }

  const handleTransferSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setTransactionStatus("approve");

      let disperse_addresses = parseText(transferTo).updatedRecivers;
      let disperse_amounts = parseText(transferTo).updatedAmounts;
      let disperse_amounts_number = parseText(transferTo).updatedAmounts_number;
      let disperse_amounts_sum = disperse_amounts_number
        .reduce((sum, p) => sum.add(p))
        .toString();

      console.log(cairo.uint256(disperse_amounts_sum));

      const multiCall = await account.execute([
        // Calling the first contract
        {
          contractAddress: erc20Address,
          entrypoint: "increaseAllowance",
          calldata: CallData.compile({
            spender: getDisperseAddress(network),
            amount: cairo.uint256(disperse_amounts_sum),
          }),
        },
        // Calling the second contract
        {
          contractAddress: getDisperseAddress(network),
          entrypoint: "disperse_token",
          calldata: CallData.compile({
            token: erc20Address,
            addresses: disperse_addresses,
            amounts: disperse_amounts,
          }),
        },
      ]);
      // await provider.waitForTransaction(multiCall.transaction_hash);
      console.log(multiCall);

      setLastTransactionHash(multiCall.transaction_hash);
      setTransactionStatus("pending");
    } catch (e) {
      console.error(e);
      setTransactionStatus("idle");
    }
  };

  return (
    <>
      <h3 style={{ margin: 0 }}>
        Transaction status: <code>{transactionStatus}</code>
      </h3>
      {lastTransactionHash && (
        <h3 style={{ margin: 0 }}>
          Transaction hash:{" "}
          <a
            href={`${getExplorerBaseUrl()}/tx/${lastTransactionHash}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "blue", margin: "0 0 1em" }}
          >
            <code>{truncateHex(lastTransactionHash)}</code>
          </a>
        </h3>
      )}
      {transactionError && (
        <h3 style={{ margin: 0 }}>
          Transaction error:{" "}
          <textarea
            style={{ width: "100%", height: 100, background: "white" }}
            value={transactionError}
            readOnly
          />
        </h3>
      )}
      <div className="columns">
        <form onSubmit={handleTransferSubmit}>
          <h2 className={styles.title}>Transfer token</h2>

          <label htmlFor="erc20-address">
            Token contract address (Find your token address on blockchain
            explorer or your wallet)
          </label>
          <input
            style={{
              width: "80%",
              height: "10%",
              background: "white",
              color: "black",
            }}
            id="erc20-address"
            name="fname"
            value={erc20Address}
            onChange={(e) => seterc20Address(e.target.value)}
            placeholder="0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
          />

          <label htmlFor="transfer-to">To (Addresses Amounts)</label>
          <textarea
            style={{
              width: "80%",
              height: "20%",
              background: "white",
              color: "black",
            }}
            id="transfer-to"
            name="fname"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            placeholder="0x04d39eDc003cC15fEBE622D34E4883bF2684D27984e6824017489fe7a0f3929b 0.1 &#10;0x00a1Bd433f88a1bEe1ee61AA8d6dF356b5Cc662FE6947B3b310F76faE18CA35F 0.2"
          />
          <br />
          <input type="submit" disabled={buttonsDisabled} value="Transfer" />
        </form>
      </div>
    </>
  );
};
