import WildCoin from REACT_APP_CONTRACT_PROFILE
pub fun main(account: Address): UFix64 {
    let acct = getAccount(account)

    let acctReceiverRef = acct.getCapability<&WildCoin.Vault{WildCoin.Balance}>(/public/Vault)
        .borrow()
        ?? panic("Could not borrow a reference to the acct receiver")

    log("Account Balance")
    return acctReceiverRef.balance
}
