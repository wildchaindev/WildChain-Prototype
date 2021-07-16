pub fun main(account: Address, nftId: UInt64) : {String : String} {
    let nftOwner = getAccount(account)
    let capability = nftOwner.getCapability(/public/NFTReceiver)
    let receiverRef = capability.borrow<&{WildNFT.NFTReceiver}>()
        ?? panic("Could not borrow the receiver reference")

    return receiverRef?.getMetadata(id: nftId)
}
