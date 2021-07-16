transaction(KeysData: String, ValuesData: String) {
    // If the person executing this tx doesn't have access to the
    // resource, then the tx will fail. Thus, references...
    let receiverRef: &{WildNFT.NFTReceiver}
    let minterRef: &WildNFT.NFTMinter

    // ...in "prepare", the code borrows capabilities on the two resources referenced above,
    // takes in information of the person executing the tx, and validates.
    prepare(acct: AuthAccount) {
        self.receiverRef = acct.getCapability<&{WildNFT.NFTReceiver}>(/public/NFTReceiver)
            .borrow()
            ?? panic("Could not borrow minter reference.")

        self.minterRef = acct.borrow<&WildNFT.NFTMinter>(from: /storage/WildNFTMinter)
            ?? panic("Could not borrow minter reference.")
    }

    execute {

        let metadata : {String : String} = {KeysData : ValuesData} //{KeysData.slice(from: 4, upTo: KeysData.length): ValuesData.slice(from: 4, upTo: ValuesData.length)}

        // This is where the NFT resource itself is created
        let newNFT <- self.minterRef.mintNFT()

        // This is where the metadata comes into the picture to join with the new NFT!
        self.receiverRef.deposit(token: <-newNFT, metadata: metadata)

        log("NFT has been minted and deposited to Account's Collection")
    }
}
