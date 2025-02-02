# Marketplace With Next.JS

## Introduction

In this guide, you will learn how to create a marketplace like [OpenSea](https://opensea.io/) on the Rinkeby Ethereum test network!

By the end, we'll implement the following features:

- A marketplace where we can list NFTs for **direct sale** or for **auction**.
- Allow users to **make bids** and **buy** our NFTs.

## Tools

- [**thirdweb Marketplace**](https://portal.thirdweb.com/contracts/marketplace): to facilitate the listing of NFTs and enable users to make buy, sell, or make offers on the NFTs on the marketplace.
- [**thirdweb NFT Collection**](https://portal.thirdweb.com/contracts/nft-collection): to create an ERC721 NFT Collection that we can list onto the marketplace.
- [**thirdweb React SDK**](https://docs.thirdweb.com/react): to enable users to connect and disconnect their wallets with our website, and prompt them to approve transactions with MetaMask.
- [**thirdweb TypeScript SDK**](https://docs.thirdweb.com/typescript): to connect to our NFT Collection Smart contract via TypeScript & React hooks such as [useMarketplace](https://docs.thirdweb.com/react/react.usemarketplace), mint new NFTs, create new listings, and view all of the listings for sale!
- [**Next JS Dynamic Routes**](https://nextjs.org/docs/routing/dynamic-routes): so we can have a dynamic route for each listing. eg. `listing/1` will show listing 1.

## Using This Repo

- Click on the **Use this template** button to create your own copy of this repo:

![use this template.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651048077489/WeMVOeg6W.png)

- Create your own Marketplace contract via the thirdweb dashboard. (follow the steps in the guide below if you need extra help)

- Create a `.env.local` file and add your Marketplace contract address to it. In the form: `NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=0x00000`.

- Install the required dependencies:

```bash
npm install
# or
yarn install
```

- Run the development server:

```bash
npm run dev
# or
yarn dev
```

- Visit http://localhost:3000/ to view the demo.

Need More help? Want to understand the code a bit more? Want to set the project up yourself? Follow the guide below! 👇

---

## Creating A Marketplace

To create a marketplace contract:

- Head to the [thirdweb dashboard](https://thirdweb.com/dashboard).
- Click **Create a new contract**.
- Click **Setup Marketplace**.
- Configure & Deploy!

## The Thirdweb Provider

The thirdweb React provider makes it straightforward to let your users connect their wallets to your website, and it abstracts away all the boilerplate you would usually have to write.

Open `pages/_app.tsx` we wrap all of our pages in the `<ThirdwebProvider>` component.

```tsx
<ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
  <Component {...pageProps} />
</ThirdwebProvider>
```

## Signing Users In With Their Wallets

We connect user's wallets to our website by using the thirdweb React SDK's [useMetamask](https://docs.thirdweb.com/react/react.usemetamask) hook.

```ts
const connectWithMetamask = useMetamask();
```

## Displaying Listings On The Marketplace

On the [index.tsx file](pages/index.tsx), we're displaying all of the current **active** listings on the marketplace.

We're using React's `useState` to store the listings as well as a loading flag.

```ts
// Loading Flag
const [loadingListings, setLoadingListings] = useState<boolean>(true);
// Store Listings
const [listings, setListings] = useState<(AuctionListing | DirectListing)[]>(
  []
);
```

Then, we use the [useMarketplace](https://docs.thirdweb.com/react/react.usemarketplace) hook to connect to our smart contract via it's contract address.

```ts
const marketplace = useMarketplace(
  process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS // Your marketplace contract address here
);
```

Once the marketplace is ready, we call `getActiveListings` inside a `useEffect` hook to get all of the listings that are currently active (i.e. haven't expired or sold already).

```ts
useEffect(() => {
  (async () => {
    if (marketplace) {
      // Get all listings from the marketplace
      setListings(await marketplace?.getActiveListings());

      // Set loading to false when the listings are ready
      setLoadingListings(false);
    }
  })();
}, [marketplace?.getActiveListings]);
```

Once we have the listings, we can display them to our users.

We'll leave the details of how best to display the listings up to you, but if you're looking for an example, check out the code in our [index.tsx file](pages/index.tsx) file.

## Listing Items on the marketplace

We have a page called [create.tsx](pages/create.tsx) that lets users upload existing NFTs onto the marketplace.

If you don't have NFTs that you can list, [you can create an NFT Collection via our dashboard](https://thirdweb.com/dashboard).

Once again, we are using the `useMarketplace` hook to connect to our marketplace smart contract via it's contract address.

```ts
const marketplace = useMarketplace(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS
  );
};
```

**Create Auction Type Listing:**

```ts
async function createAuctionListing(
  contractAddress: string,
  tokenId: string,
  price: string
) {
  try {
    const transaction = await marketplace?.auction.createListing({
      assetContractAddress: contractAddress, // Contract Address of the NFT
      buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
      currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the cryptocurency that is native to the network. i.e. Rinkeby ETH.
      listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
      quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
      reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
      startTimestamp: new Date(), // When the listing will start (now)
      tokenId: tokenId, // Token ID of the NFT.
    });

    return transaction;
  } catch (error) {
    console.error(error);
  }
}
```

**Create Direct Type Listing**

```ts
async function createDirectListing(
  contractAddress: string,
  tokenId: string,
  price: string
) {
  try {
    const transaction = await marketplace?.direct.createListing({
      assetContractAddress: contractAddress, // Contract Address of the NFT
      buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
      currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the cryptocurency that is native to the network. i.e. Rinkeby ETH.
      listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
      quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
      startTimestamp: new Date(0), // When the listing will start (now)
      tokenId: tokenId, // Token ID of the NFT.
    });

    return transaction;
  } catch (error) {
    console.error(error);
  }
}
```

When you go to list your NFT, you'll be asked for two transactions:

1. Approve the marketplace to sell your NFTs while the NFT still lives in your wallet. (`setApprovalForAll`)
2. Create the listing on the marketplace (`createListing`)

If everything worked as planned, after you approve these two transactions, you should now see the listing you just created on the home page!

## Viewing A Listing

On the home page, we provide a `Link` on each listing's name to a URL that looks like: `/listing/${listing.id}`. This is using [Next JS's Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes).

This way, each NFT navigates the user to a page that shows the details of the listing when they click on it, by taking them to the `/listing/[listingId]` page.

When the user visits the `/listing/[listingId]` page, we can fetch the information about the listing the user is looking at! E.g if the user visits `/listing/1`, we call `marketplace.getListing(1)` and load that listings information!

**Fetching The Listing**

```ts
const marketplace = useMarketplace(
  process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS
);

useEffect(() => {
  if (!listingId || !marketplace) {
    return;
  }
  (async () => {
    // Use the listingId from the router.query to get the listing the user is looking at.
    const l = await marketplace.getListing(listingId);

    setLoadingListing(false);
    setListing(l);
  })();
}, [listingId, marketplace]);
```

On the `/listing/[listingId]` page, we'll want users to also be able to place bids/offers on the listing, and also buy the listing!

**Creating A Bid / Offer**

```ts
async function createBidOrOffer() {
  try {
    // If the listing type is a direct listing, then we can create an offer.
    if (listing?.type === ListingType.Direct) {
      await marketplace?.direct.makeOffer(
        listingId, // The listingId of the listing we want to make an offer for
        1, // Quantity = 1
        "0xc778417E063141139Fce010982780140Aa0cD5Ab", // WETH address on Rinkeby network
        bidAmount // The offer amount the user entered
      );
    }

    // If the listing type is an auction listing, then we can create a bid.
    if (listing?.type === ListingType.Auction) {
      await marketplace?.auction.makeBid(listingId, bidAmount);
    }
  } catch (error) {
    console.error(error);
  }
}
```

**Buying the NFT**

```ts
async function buyNft() {
  try {
    // Simple one-liner for buying the NFT
    await marketplace?.buyoutListing(listingId, 1);
  } catch (error) {
    console.error(error);
  }
}
```

We attach these functions to the `onClick` handlers of our `Buy` and `Make Offer` buttons. If you want to see how we do that, check out the code in our [[listingId].tsx file](pages/listing/[listingId].tsx) page.

**Note:** For making offers, you'll need to have an ERC20 token. For our Rinkeby marketplace, that means you'll need to have wrapped ETH (wETH).

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
