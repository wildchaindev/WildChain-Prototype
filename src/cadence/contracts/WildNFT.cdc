pub contract WildNFT {

    // Event that is emitted when a new NFT is put up for sale
    pub event NFTMinted(id: UInt64)

  // Declare the NFT resource type
    pub resource NFT {
        // The unique ID that differentiates each NFT
        pub let id: UInt64

        // Initialize fields in the init function
        init(initID: UInt64) {
            self.id = initID
        }
    }

    // We define this interface purely as a way to allow users
    // to create public, restricted references to their NFT Collection.
    // They would use this to only expose the deposit, getIDs,
    // idExists, and getMetadata fields in their Collection
    pub resource interface NFTReceiver {

        pub fun deposit(token: @NFT, metadata: {String : String}) 

        pub fun getIDs(): [UInt64]

        pub fun idExists(id: UInt64): Bool

        pub fun getMetadata(id: UInt64): {String : String}
    }

    // The definition of the Collection resource that
    // holds the NFTs that a user owns
    pub resource Collection: NFTReceiver {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        
        // ownedNFTs keeps track of all NFTs a user owns 
        pub var ownedNFTs: @{UInt64: NFT}

        // metadataObjs extends Flow NFT contract functionality to 
        // map an NFT's token id to its associated metadata--
        // which means you need the NFT's token id before you can set this var.
        pub var metadataObjs: {UInt64: {String : String}}

        // Initialize the ownedNFTs field to an empty collection (for NFTs),
        // and the metadataObjs field to an empty dictionary (for Strings)
        init () {
            self.ownedNFTs <- {}
            self.metadataObjs = {}
        }

        // withdraw 
        //
        // Function that removes an NFT from the collection 
        // and moves it to the calling context
        pub fun withdraw(withdrawID: UInt64): @NFT {
            // If the NFT isn't found, the transaction panics and reverts
            let token <- self.ownedNFTs.remove(key: withdrawID)!

            return <-token
        }

        // deposit 
        //
        // Function that takes an NFT and its metadata as an argument, and 
        // adds the NFT to the collections dictionary and
        // adds its associated metadata to the metadata dictionary.
        // NOTE: to make sure that only the minter of the token can add
        // metadata to the token, the addition of metadata is confined to the minting execution.
        pub fun deposit(token: @NFT, metadata: {String : String}) {
            self.metadataObjs[token.id] = metadata
            self.ownedNFTs[token.id] <-! token
            // As opposed to this other technique,
            // adding the new token to the dictionary which removes the old one:
            //let oldToken <- self.ownedNFTs[token.id] <- token
            //destroy oldToken
        }

        pub fun updateMetadata(id: UInt64, metadata: {String: String}) {
            self.metadataObjs[id] = metadata
        }

        pub fun getMetadata(id: UInt64): {String : String} {
            return self.metadataObjs[id]!
        }

        // idExists checks to see if a NFT 
        // with the given ID exists in the collection
        pub fun idExists(id: UInt64): Bool {
            return self.ownedNFTs[id] != nil
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // creates a new empty Collection resource and returns it 
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }


    // public, restricted references to NFT Minter.
    pub resource interface NFTMinterAccessPub {

        pub fun getAccounts(): [Address]
    }

    //NFTMinterAccess
    //
    // Resource for storing minter access list
    pub resource NFTMinterAccess: NFTMinterAccessPub {

         // list of accounts with Minting rights
        pub var accounts: [Address]

        init() {
            self.accounts = []
        }

        // return list of accounts with Minting rights
        pub fun getAccounts(): [Address] {
            return self.accounts
        }

        pub fun addAccount(mintAccount: Address) {
            self.accounts.append(mintAccount)
        }
    }

    pub resource interface NFTAuthMint {

        pub fun authMint(authUser: AuthAccount) 

    }

    // NFTMinter
    //
    // Resource that would be owned by an admin or by a smart contract 
    // that allows them to mint new NFTs when needed
    pub resource NFTMinter: NFTAuthMint {

        // the ID that is used to mint NFTs
        // it is only incremented so that NFT ids remain
        // unique. It also keeps track of the total number of NFTs
        // in existence.
        pub var idCount: UInt64

        init() {
            self.idCount = 1
        }

        // mintNFT 
        //
        // Function that mints a new NFT with a new ID
        // and, instead of depositing the NFT into a specific recipient's collection storage location,
        // just returns the NFT itself!
        pub fun mintNFT(): @NFT {

            // create a new NFT! This is where the NFT's core ID gets created.
            // Right now, it's just getting this ID from the idCount field, which
            // merely increments up with each NFT minted. If we want to create more
            // complex IDs with hashing etc., this would be the place to put that new ID
            // generated from that technique.
            var newNFT <- create NFT(initID: self.idCount)

            emit NFTMinted(id: self.idCount)

            // Increments the id so that each ID is unique
            self.idCount = self.idCount + 1 as UInt64

            return <-newNFT
        }

        pub fun authMint(authUser: AuthAccount){
            let account = getAccount(REACT_APP_CONTRACT_PROFILE)
            let capability = account.getCapability(/public/AccessList) 
            let ref = capability.borrow<&{WildNFT.NFTMinterAccessPub}>() 
            ?? panic("Could not borrow account access list reference")
            let minterList = ref.getAccounts()
            if (minterList.contains(authUser.address)){
                let newNFT <- self.mintNFT()
                authUser.save(<-newNFT, to: /storage/MintedNFT)
            }
        }
    }


    init() {

        let existing <-  self.account.load<@WildNFT.Collection>(from: /storage/WildNFTCollection)
        destroy existing

		// store an empty NFT Collection in account storage
        self.account.save(<-self.createEmptyCollection(), to: /storage/WildNFTCollection)

        // publish a reference to the Collection in storage
        self.account.link<&{NFTReceiver}>(/public/NFTReceiver, target: /storage/WildNFTCollection)

        let existingMinter <-  self.account.load<@WildNFT.NFTMinter>(from: /storage/WildNFTMinter)
        destroy existingMinter

        // store a minter resource in account storage
        self.account.save(<-create NFTMinter(), to: /storage/WildNFTMinter)
        self.account.link<&{NFTAuthMint}>(/public/AuthMint, target: /storage/WildNFTMinter)

        let existingMinterAccess <-  self.account.load<@WildNFT.NFTMinterAccess>(from: /storage/WildNFTMinterAccess)
        destroy existingMinterAccess

        // store minter access list in storage
        self.account.save(<-create NFTMinterAccess(), to: /storage/WildNFTMinterAccess)

        // publish a reference to the minter access list in storage
        self.account.link<&{NFTMinterAccessPub}>(/public/AccessList, target: /storage/WildNFTMinterAccess)



    }
}
