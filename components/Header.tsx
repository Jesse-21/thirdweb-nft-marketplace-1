import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import React from "react";
import styles from "../styles/Home.module.css";

type Props = {};

export default function Header({}: Props) {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div>
          <a
            href="https://thirdweb-nft-marketplace-roan.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={`/logo.png`} alt="OF 1 NFT Logo" width={135} />
          </a>
        </div>
      </div>
      <div className={styles.right}>
        {address ? (
          <>
            <a
              className={styles.secondaryButton}
              onClick={() => disconnectWallet()}
            >
              Disconnect Wallet
            </a>
            <p style={{ marginLeft: 8, marginRight: 8, color: "grey" }}>|</p>
            <p>{address.slice(0, 6).concat("...").concat(address.slice(-4))}</p>
          </>
        ) : (
          <a
            className={styles.mainButton}
            onClick={() => connectWithMetamask()}
          >
            Connect Wallet
          </a>
        )}
      </div>
    </div>
  );
}
