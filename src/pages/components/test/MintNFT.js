//import React, { useState } from "react";
import * as fcl from "@onflow/fcl";

const MintNFT = () => {
  //const [nftInfo, setNftInfo] = useState(null)
  const Mint = async () => {
    const encoded = await fcl
      .send([
        fcl.transaction`
        import WildNFT from 0xProfile

        transaction(KeysData: String, ValuesData: String) {
          // If the person executing this tx doesn't have access to the
          // resource, then the tx will fail. Thus, references...
          let receiverRef: &{WildNFT.NFTReceiver}
          let minterRef: &WildNFT.NFTAuthMint
      
          // ...in "prepare", the code borrows capabilities on the two resources referenced above,
          // takes in information of the person executing the tx, and validates.
          prepare(acct: AuthAccount) {
              self.receiverRef = acct.getCapability<&{WildNFT.NFTReceiver}>(/public/NFTReceiver)
                  .borrow()
                  ?? panic("Could not borrow receiver reference.")
      
              self.minterRef = acct.getCapability<&{WildNFT.NFTAuthMint}>(/public/AuthMint)
                  .borrow()
                  ?? panic("Could not borrow auth minter reference.")
              
              let metadata : {String : String} = {KeysData : ValuesData} //{KeysData.slice(from: 4, upTo: KeysData.length): ValuesData.slice(from: 4, upTo: ValuesData.length)}
      
              // This is where the NFT resource itself is created
              self.minterRef.authMint(acct)
              let newNFT <- acct.load<WilfNFT.NFT>(from: /storage/MintedNFT)!

              // This is where the metadata comes into the picture to join with the new NFT!
              self.receiverRef.deposit(token: <-newNFT, metadata: metadata)
      
              log("NFT has been minted and deposited to Account's Collection")
          }
      }
      `,
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.payer(fcl.authz)
    ]
    )
    
    const decoded = await fcl.decode(encoded)
  };
  return (
    <div className="mint-nft">
        <div className="center">
        <div className="fancy">
        <div className="center">
            <button className="btn-primary" onClick={Mint}>Mint NFT</button>        
        </div>
        </div>
        </div>
    </div>
  );
};

export default MintNFT;