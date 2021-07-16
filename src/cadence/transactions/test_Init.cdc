import WildNFT, WildCoin, Marketplace from REACT_APP_CONTRACT_PROFILE

transaction {
    prepare(acct: AuthAccount) {

        // Delete any existing collection
        let existing <- acct.load<@WildNFT.Collection>(from: /storage/WildNFTCollection)
        destroy existing
        let existingVault <- acct.load<@WildCoin.Vault>(from: /storage/MainVault)
        destroy existingVault

        // Create a new empty collection
        let collection <- WildNFT.createEmptyCollection()

        // store the empty NFT Collection in account storage
        acct.save<@WildNFT.Collection>(<-collection, to: /storage/WildNFTCollection)

        // create a public capability for the Collection
        acct.link<&AnyResource{WildNFT.NFTReceiver}>(/public/NFTReceiver, target: /storage/WildNFTCollection)

        // Initialize Token Vault
        let vault <- WildCoin.createEmptyVault()
        acct.save(<-vault, to: /storage/MainVault)
        acct.link<&AnyResource{WildCoin.Vault}>(/public/Vault, target: /storage/MainVault)

        // Initialize Sale Collection
        let receiver = acct.getCapability<&{WildCoin.Receiver}>(/public/Vault)
        let sale <- Marketplace.createSaleCollection(ownerVault: receiver)
        acct.save<@Marketplace.SaleCollection>(<-sale, to: /storage/NFTSale)
        acct.link<&Marketplace.SaleCollection{Marketplace.SalePublic}>(/public/NFTSale, target: /storage/NFTSale)
    }
}
