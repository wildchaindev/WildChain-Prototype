import WildNFT, WildCoin, Marketplace from REACT_APP_CONTRACT_PROFILE

// Transaction that "posts an NFT on the marketplace as for sale" by:
// creating a sale collection, 
// withdrawing an NFT from the receiver account, 
// and calling the Marketplace function to emit the ForSale event
// and post the NFT with its price on the site. 

transaction(nftID: UInt64, salePrice: UFix64){

  prepare(acct: AuthAccount) {
      let receiver = acct.getCapability<&{WildCoin.Receiver}>(/public/Vault)

      //let sale = acct.borrow<&Marketplace.SaleCollection>(from: /storage/NFTSale)
      let sale <- acct.load<@Marketplace.SaleCollection>(from: /storage/NFTSale)!
      let collectionRef = acct.borrow<&WildNFT.Collection>(from: /storage/WildNFTCollection)
          ?? panic("Could not borrow owner's nft collection reference")

      let token <- collectionRef.withdraw(withdrawID: nftID)

      sale.listForSale(token: <-token, price: salePrice, metadata: collectionRef.metadataObjs.remove(key: nftID)!)

      acct.save(<-sale, to: /storage/NFTSale)

      //acct.link<&Marketplace.SaleCollection{Marketplace.SalePublic}>(/public/NFTSale, target: /storage/NFTSale)

  }
}
