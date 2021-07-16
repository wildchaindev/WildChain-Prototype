import WildNFT, WildCoin, Marketplace from REACT_APP_CONTRACT_PROFILE

// Transaction that "posts an NFT on the marketplace as for sale" by:
// creating a sale collection, 
// withdrawing an NFT from the receiver account, 
// and calling the Marketplace function to emit the ForSale event
// and post the NFT with its price on the site. 

transaction {

    prepare(acct: AuthAccount) {
        let receiver = acct.getCapability<&{WildCoin.Receiver}>(/public/Vault)
        let sale <- Marketplace.createSaleCollection(ownerVault: receiver)

        let collectionRef = acct.borrow<&WildNFT.Collection>(from: /storage/WildNFTCollection)
            ?? panic("Could not borrow owner's nft collection reference")

        let token <- collectionRef.withdraw(withdrawID: 4)

        sale.listForSale(token: <-token, price: 10.0) //updated with 3rd parameter

        acct.save(<-sale, to: /storage/NFTSale)

        acct.link<&Marketplace.SaleCollection{Marketplace.SalePublic}>(/public/NFTSale, target: /storage/NFTSale)

        log("Sale Created for account 1. Selling NFT 1 for 10 tokens")
    }
}
