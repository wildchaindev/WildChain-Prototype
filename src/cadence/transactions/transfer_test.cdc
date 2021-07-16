import WildNFT from REACT_APP_CONTRACT_PROFILE

transaction(nftId: UInt64, receiver: Address) {

    // The field that will hold the NFT as it is being
    // transferred to the other account
    let transferToken: @WildNFT.NFT
    let nftMetadata: {String : String}
    prepare(acct: AuthAccount) {

        // Borrow a reference from the stored collection
        let collectionRef = acct.borrow<&WildNFT.Collection>(from: /storage/WildNFTCollection)
            ?? panic("Could not borrow a reference to the owner's collection")

        self.nftMetadata = collectionRef.getMetadata(id: nftId)
        collectionRef.updateMetadata(id: nftId, metadata: {})
        
        // Call the withdraw function on the sender's Collection
        // to move the NFT out of the collection
        self.transferToken <- collectionRef.withdraw(withdrawID: nftId)
    }

    execute {
        // Get the recipient's public account object
        let recipient = getAccount(receiver)

        // Get the Collection reference for the receiver
        // getting the public capability and borrowing a reference from it
        let receiverRef = recipient.getCapability<&{WildNFT.NFTReceiver}>(/public/NFTReceiver)
            .borrow()
            ?? panic("Could not borrow receiver reference")

        // Deposit the NFT in the receivers collection
        receiverRef.deposit(token: <-self.transferToken, metadata: self.nftMetadata)
    }
}
 
