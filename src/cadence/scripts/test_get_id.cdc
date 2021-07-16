
import WildNFT from REACT_APP_CONTRACT_PROFILE

pub fun main(account: Address) : [UInt64]?{

    // Get both public account objects
    let account1 = getAccount(account)

    // Find the public Receiver capability for their Collections
    let acct1Capability = account1.getCapability(/public/NFTReceiver)

    // borrow references from the capabilities
    let receiver1Ref = acct1Capability.borrow<&{WildNFT.NFTReceiver}>()
        ?? panic("Could not borrow account 1 receiver reference")

    // Print both collections as arrays of IDs
    return receiver1Ref.getIDs()
}
