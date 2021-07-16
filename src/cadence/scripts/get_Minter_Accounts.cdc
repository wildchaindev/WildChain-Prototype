import WildNFT from REACT_APP_CONTRACT_PROFILE

pub fun main() : [Address]? {
    let account = getAccount(REACT_APP_CONTRACT_PROFILE)
    let capability = account.getCapability(/public/AccessList) 
    let ref = capability.borrow<&{WildNFT.NFTMinterAccessPub}>() 
        ?? panic("Could not borrow account access list reference")

    return ref.getAccounts()
}
