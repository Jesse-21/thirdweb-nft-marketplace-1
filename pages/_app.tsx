import React from "react";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Head from "next/head";
import ThirdwebGuideFooter from "../components/ThirdwebGuideFooter";
import ThirdwebGuideOverlay from "../components/ThirdwebGuideOverlay";
import Header from "../components/Header";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Polygon;

function MyApp({ Component, pageProps }: AppProps) {
  const [showGuideOverlay, setShowGuideOverlay] = React.useState(false);
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <ThirdwebGuideOverlay
        show={showGuideOverlay}
        setShow={setShowGuideOverlay}
      />
      <Head>
        <title>OF 1 NFT Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="List Your NFTs For Sale, Accept Bids, and Buy NFTs"
        />
        <meta
          name="keywords"
          content="Thirdweb, Marketplace, NFT Marketplace, NFT Auction, OF 1 NFT, JESSE21, NEXT-JS"
        />
      </Head>
      <Header />
      <Component {...pageProps} />
      <ThirdwebGuideFooter onLearnMore={() => setShowGuideOverlay(true)} />
    </ThirdwebProvider>
  );
}

export default MyApp;
