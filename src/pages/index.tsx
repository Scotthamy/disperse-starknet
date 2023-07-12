import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { AccountInterface, shortString, ProviderInterface } from "starknet";

import { TokenDapp } from "../components/TokenDapp";
import { truncateAddress } from "../services/address.service";
import { connectWallet, networkId } from "../services/wallet.service";
import styles from "../styles/Home.module.css";
import { getDisperseUrl } from "../services/utils.service";

const github_url = "https://github.com/Scotthamy/disperse-starknet";

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>();
  const [chain, setChain] = useState<string>();
  const [isConnected, setConnected] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);

  const handleConnectClick = async () => {
    const wallet = await connectWallet();
    setAddress(wallet?.selectedAddress);
    setChain(shortString.decodeShortString(wallet?.provider.chainId));
    setConnected(!!wallet?.isConnected);
    if (wallet?.account) {
      setAccount(wallet.account);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {isConnected ? (
          <>
            <h3 style={{ margin: 0 }}>
              Wallet address: <code>{address && truncateAddress(address)}</code>
            </h3>
            <h3 style={{ margin: 0 }}>
              Network: <code>{chain}</code>
            </h3>
            <h3 style={{ margin: 0 }}>
              Contracts and Github:{" "}
              <code className="contract">
                <a href={getDisperseUrl("SN_GOERLI")}>SN_GOERLI</a>
              </code>
              <code>
                <a href={getDisperseUrl("SN_MAIN")}>SN_MAIN</a>
              </code>
              <code>
                <a href={github_url}>disperse-starknet</a>
              </code>
            </h3>
            {account && <TokenDapp account={account} chain={chain} />}
          </>
        ) : (
          <>
            <button className={styles.connect} onClick={handleConnectClick}>
              Connect Wallet
            </button>
            <p>First connect wallet to use dapp.</p>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
