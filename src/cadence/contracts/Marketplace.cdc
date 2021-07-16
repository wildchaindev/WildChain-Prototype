import WildCoin from REACT_APP_CONTRACT_PROFILE
import WildNFT from REACT_APP_CONTRACT_PROFILE

pub contract Marketplace {

    // Event that is emitted when a new NFT is put up for sale
    pub event ForSale(id: UInt64, price: UFix64, seller: Address?)

    // Event that is emitted when the price of an NFT changes
    pub event PriceChanged(id: UInt64, newPrice: UFix64)
    
    // Event that is emitted when a token is purchased
    pub event TokenPurchased(id: UInt64, price: UFix64)

    // Event that is emitted when a seller withdraws their NFT from the sale
    pub event SaleWithdrawn(id: UInt64)

    // Interface that users will publish for their Sale collection
    // that only exposes the methods that are supposed to be public
    pub resource interface SalePublic {
        pub fun purchase(tokenID: UInt64, recipient: &AnyResource{WildNFT.NFTReceiver}, buyTokens: @WildCoin.Vault)
        pub fun idPrice(tokenID: UInt64): UFix64?
        pub fun getIDs(): [UInt64]
        pub fun getMetadata(id: UInt64): {String : String}
    }

    // SaleCollection,
    // An NFT Collection object that allows a user to put their NFT up for sale
    // where others can send fungible tokens to purchase it
    pub resource SaleCollection: SalePublic {

        // Dictionary of the NFTs that the user is putting up for sale
        pub var forSale: @{UInt64: WildNFT.NFT}

        // Dictionary of the prices for each NFT by ID
        pub var prices: {UInt64: UFix64}

        // metadataObjs extends Flow NFT contract functionality to 
        // map an NFT's token id to its associated metadata--
        // which means you need the NFT's token id before you can set this var.
        pub var metadataObjs: {UInt64: {String : String}}

        // The fungible token vault of the owner of this sale.
        // When someone buys a token, this resource can deposit
        // tokens into their account.
        access(account) let ownerVault: Capability<&AnyResource{WildCoin.Receiver}>

        init (vault: Capability<&AnyResource{WildCoin.Receiver}>) {
            self.forSale <- {}
            self.metadataObjs = {}
            self.ownerVault = vault
            self.prices = {}
        }

        pub fun getMetadata(id: UInt64): {String : String} {
            return self.metadataObjs[id]!
        }

        // withdraw gives the owner the opportunity to remove a sale from the collection
        pub fun withdraw(tokenID: UInt64): @WildNFT.NFT {
            // remove the price
            self.prices.remove(key: tokenID)
            // remove and return the token
            let token <- self.forSale.remove(key: tokenID) ?? panic("missing NFT")
            return <-token
        }

        // listForSale lists an NFT for sale in this collection
        pub fun listForSale(token: @WildNFT.NFT, price: UFix64, metadata: {String:String}) {
            let id = token.id

            // store the price in the price array
            self.prices[id] = price

            // store the metadata in metadataObjs
            self.metadataObjs[id] = metadata

            // put the NFT into the the forSale dictionary
            let oldToken <- self.forSale[id] <- token
            destroy oldToken

            emit ForSale(id: id, price: price, seller: self.owner?.address)
        }

        // changePrice changes the price of a token that is currently for sale
        pub fun changePrice(tokenID: UInt64, newPrice: UFix64) {
            self.prices[tokenID] = newPrice

            emit PriceChanged(id: tokenID, newPrice: newPrice)
        }

        // purchase lets a user send tokens to purchase an NFT that is for sale
        pub fun purchase(tokenID: UInt64, recipient: &AnyResource{WildNFT.NFTReceiver}, buyTokens: @WildCoin.Vault) {
            pre {
                self.forSale[tokenID] != nil && self.prices[tokenID] != nil:
                    "No token matching this ID for sale!"
                buyTokens.balance >= (self.prices[tokenID] ?? 0.0):
                    "Not enough tokens to by the NFT!"
            }

            // get the value out of the optional
            let price = self.prices[tokenID]!
            
            self.prices[tokenID] = nil

            let vaultRef = self.ownerVault.borrow()
                ?? panic("Could not borrow reference to owner token vault")
            
            // deposit the purchasing tokens into the owners vault
            vaultRef.deposit(from: <-buyTokens)

            let metadata = self.metadataObjs.remove(key: tokenID)!

            // deposit the NFT into the buyers collection and its metadata into the buyers metadata dictionary
            recipient.deposit(token: <-self.withdraw(tokenID: tokenID), metadata: metadata)

            emit TokenPurchased(id: tokenID, price: price)
        }

        // idPrice returns the price of a specific token in the sale
        pub fun idPrice(tokenID: UInt64): UFix64? {
            return self.prices[tokenID]
        }

        // getIDs returns an array of token IDs that are for sale
        pub fun getIDs(): [UInt64] {
            return self.forSale.keys
        }

        destroy() {
            destroy self.forSale
        }
    }

    // createCollection returns a new collection resource to the caller
    pub fun createSaleCollection(ownerVault: Capability<&AnyResource{WildCoin.Receiver}>): @SaleCollection {
        return <- create SaleCollection(vault: ownerVault)
    }

    init() {
        let receiver = self.account.getCapability<&{WildCoin.Receiver}>(/public/Vault)
        let sale <- self.createSaleCollection(ownerVault: receiver)
        self.account.save<@Marketplace.SaleCollection>(<-sale, to: /storage/NFTSale)
        self.account.link<&Marketplace.SaleCollection{Marketplace.SalePublic}>(/public/NFTSale, target: /storage/NFTSale)
    }
}
 
