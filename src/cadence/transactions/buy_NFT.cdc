import WildNFT,WildCoin,Marketplace from REACT_APP_CONTRACT_PROFILE

// This transaction uses the signer's tokens to purchase an NFT
// from the Sale collection of the seller account.
transaction(sellerAcct: Address, nftID: UInt64, tokenAmount: UFix64) {

  // reference to the buyer's NFT collection where they
  // will store the bought NFT
  let collectionRef: &AnyResource{WildNFT.NFTReceiver}

  // Vault that will hold the tokens that will be used to
  // but the NFT
  let temporaryVault: @WildCoin.Vault

  prepare(acct: AuthAccount) {

    // get the references to the buyer's fungible token Vault
    // and NFT Collection Receiver
    self.collectionRef = acct.borrow<&AnyResource{WildNFT.NFTReceiver}>(from: /storage/WildNFTCollection)
        ?? panic("Could not borrow reference to the signer's nft collection")

    let vaultRef = acct.borrow<&WildCoin.Vault>(from: /storage/MainVault)
        ?? panic("Could not borrow reference to the signer's vault")

    // withdraw tokens from the buyers Vault
    self.temporaryVault <- vaultRef.withdraw(amount: tokenAmount)
  }

  execute {
    // get the read-only account storage of the seller
    let seller = getAccount(sellerAcct)

    // get the reference to the seller's sale
    let saleRef = seller.getCapability<&AnyResource{Marketplace.SalePublic}>(/public/NFTSale)
        .borrow()
        ?? panic("could not borrow reference to the seller's sale")

    // purchase the NFT the the seller is selling, giving them the reference
    // to your NFT collection and giving them the tokens to buy it
    saleRef.purchase(tokenID: nftID,
        recipient: self.collectionRef,
        buyTokens: <-self.temporaryVault)

  }
}
