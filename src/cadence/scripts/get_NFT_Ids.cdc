
pub fun main(account: Address) : [UInt64]? {
    let account = getAccount(account)
    let capability = account.getCapability(/public/NFTReceiver) 
    let ref = capability.borrow<&{WildNFT.NFTReceiver}>() 
        ?? panic("Could not borrow account receiver reference")

    return ref?.getIDs()
}
