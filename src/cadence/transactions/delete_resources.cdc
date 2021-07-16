import WildNFT,WildCoin,Marketplace from REACT_APP_CONTRACT_PROFILE

        transaction {
          prepare(acct: AuthAccount) {
      
              // Delete any existing collection
              let existing <- acct.load<@WildNFT.Collection>(from: /storage/WildNFTCollection)!
              destroy existing
              let existingVault <- acct.load<@WildCoin.Vault>(from: /storage/MainVault)!
              destroy existingVault
              let existingSale <- acct.load<@Marketplace.SaleCollection>(from: /storage/NFTSale)!
              destroy existingSale
              let existingMinterAccess <- acct.load<@WildNFT.NFTMinterAccess>(from: /storage/WildNFTMinterAccess)!
              destroy existingMinterAccess
          }
        }
      
