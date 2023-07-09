import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { AccountInterface } from "starknet";

import { TokenDapp } from "../components/TokenDapp";
import { truncateAddress } from "../services/address.service";
import {
  addWalletChangeListener,
  chainId,
  connectWallet,
  removeWalletChangeListener,
  silentConnectWallet,
} from "../services/wallet.service";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>();
  const [supportSessions, setSupportsSessions] = useState<boolean | null>(null);
  const [chain, setChain] = useState(chainId());
  const [isConnected, setConnected] = useState(false);
  const [account, setAccount] = useState<AccountInterface | null>(null);

  useEffect(() => {
    const handler = async () => {
      const wallet = await silentConnectWallet();
      setAddress(wallet?.selectedAddress);
      setChain(chainId());
      setConnected(!!wallet?.isConnected);
      if (wallet?.account) {
        setAccount(wallet.account);
      }
    };

    (async () => {
      await handler();
      addWalletChangeListener(handler);
    })();

    return () => {
      removeWalletChangeListener(handler);
    };
  }, []);

  const handleConnectClick = async () => {
    const wallet = await connectWallet();
    setAddress(wallet?.selectedAddress);
    setChain(chainId());
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
            {account && <TokenDapp account={account} />}
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
