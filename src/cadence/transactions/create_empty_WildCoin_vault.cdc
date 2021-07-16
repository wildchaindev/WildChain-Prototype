import WildCoin from REACT_APP_CONTRACT_PROFILE

transaction {
	prepare(acct: AuthAccount) {
		let vaultA <- WildCoin.createEmptyVault()
			
		acct.save<@WildCoin.Vault>(<-vaultA, to: /storage/MainVault)

    log("Empty Vault stored")

		let ReceiverRef = acct.link<&WildCoin.Vault{WildCoin.Receiver, WildCoin.Balance}>(/public/MainReceiver, target: /storage/MainVault)

    log("References created")
	}

    post {
        getAccount(OTHER_ACCOUNT_ADDRESS).getCapability<&WildCoin.Vault{WildCoin.Receiver}>(/public/MainReceiver)
                        .check():  
                        "Vault Receiver Reference was not created correctly"
    }
}
