import WildNFT,WildCoin,Marketplace from REACT_APP_CONTRACT_PROFILE

transaction(minterAcct: Address) {
    prepare(acct: AuthAccount) {
        let MinterAccess <- acct.load<@WildNFT.NFTMinterAccess>(from: /storage/WildNFTMinterAccess)!
        MinterAccess.addAccount(mintAccount: minterAcct)
        acct.save(<- MinterAccess, to: /storage/WildNFTMinterAccess)
    }
}
