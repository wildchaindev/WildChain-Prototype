import Marketplace from REACT_APP_CONTRACT_PROFILE
pub fun main(account: Address): [UInt64]? {
    let acct = getAccount(account)

    let acctReceiverRef = acct.getCapability<&Marketplace.SaleCollection{Marketplace.SalePublic}>(/public/NFTSale)
        .borrow()
        ?? panic("Could not borrow a reference to the acct receiver")

    return acctReceiverRef.getIDs()
}
