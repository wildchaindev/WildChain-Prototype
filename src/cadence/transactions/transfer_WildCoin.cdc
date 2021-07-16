import WildCoin from REACT_APP_CONTRACT_PROFILE

transaction {
  var temporaryVault: @WildCoin.Vault

  prepare(acct: AuthAccount) {
    let vaultRef = acct.borrow<&WildCoin.Vault>(from: /storage/MainVault)
        ?? panic("Could not borrow a reference to the owner's vault")
      
    self.temporaryVault <- vaultRef.withdraw(amount: 1.0)
  }

  execute {
    let recipient = getAccount(OTHER_ACCOUNT_ADDRESS)

    let receiverRef = recipient.getCapability(/public/MainReceiver)
                      .borrow<&WildCoin.Vault{WildCoin.Receiver}>()
                      ?? panic("Could not borrow a reference to the receiver")

    receiverRef.deposit(from: <-self.temporaryVault)

    log("Transfer succeeded!")
  }
}
