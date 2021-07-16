import WildCoin from REACT_APP_CONTRACT_PROFILE

transaction(amt: UFix64, receivingAcct: Address) {
    let mintingRef: &WildCoin.VaultMinter

    var receiver: Capability<&WildCoin.Vault{WildCoin.Receiver}>

	prepare(acct: AuthAccount) {
        self.mintingRef = acct.borrow<&WildCoin.VaultMinter>(from: /storage/MainMinter)
            ?? panic("Could not borrow a reference to the minter")
        
        let recipient = getAccount(receivingAcct)
      
        self.receiver = recipient.getCapability<&WildCoin.Vault{WildCoin.Receiver}>
(/public/Vault)

	}

    execute {
        self.mintingRef.mintTokens(amount: amt, recipient: self.receiver)
    }
}
