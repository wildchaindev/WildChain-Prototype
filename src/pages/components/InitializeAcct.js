import React, { useState } from "react";
import * as fcl from "@onflow/fcl";

const InitializeAcct = () => {
  const [status, setStatus] = useState("Not Started")
  const initialize = async () => {
    const encoded = await fcl
      .send([
        fcl.transaction`
        import WildNFT,WildCoin,Marketplace from 0xProfile

        transaction {
          prepare(acct: AuthAccount) {
      
              // Delete any existing collection
              let existing <- acct.load<@WildNFT.Collection>(from: /storage/WildNFTCollection)
              destroy existing
              let existingVault <- acct.load<@WildCoin.Vault>(from: /storage/MainVault)
              destroy existingVault
              let existingSale <- acct.load<@Marketplace.SaleCollection>(from: /storage/NFTSale)
              destroy existingSale
      
              // Create a new empty collection
              let collection <- WildNFT.createEmptyCollection()
      
              // store the empty NFT Collection in account storage
              acct.save<@WildNFT.Collection>(<-collection, to: /storage/WildNFTCollection)
      
              // create a public capability for the Collection
              acct.link<&AnyResource{WildNFT.NFTReceiver}>(/public/NFTReceiver, target: /storage/WildNFTCollection)
      
              // Initialize Token Vault
              let vault <- WildCoin.createEmptyVault()
              acct.save(<-vault, to: /storage/MainVault)
              acct.link<&WildCoin.Vault>(/public/Vault, target: /storage/MainVault)
      
              // Initialize Sale Collection
              let receiver = acct.getCapability<&{WildCoin.Receiver}>(/public/Vault)
              let sale <- Marketplace.createSaleCollection(ownerVault: receiver)
              acct.save<@Marketplace.SaleCollection>(<-sale, to: /storage/NFTSale)
              acct.link<&Marketplace.SaleCollection{Marketplace.SalePublic}>(/public/NFTSale, target: /storage/NFTSale)
          }
      }
      `,
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.payer(fcl.authz),
      fcl.limit(50)
    ]
    )
    setStatus("Transaction Sent, Waiting for Confirmation")
    const decoded = await fcl.decode(encoded)
    const unsub = fcl.tx(decoded).subscribe(transaction => {
      if (fcl.tx.isSealed(transaction)) {
        setStatus("Transaction Confirmed: Is Sealed")
        unsub()
      }
    })
    console.log(decoded)

  };
  return (
    <div className="mint-nft">
        <div className="center">
        <div className="fancy">
        <div className="center">
            <button className="btn-primary" onClick={initialize}>Initialize Account</button>  
            <div>
              {status}
            </div>      
        </div>
        </div>
        </div>
    </div>
  );
};

export default InitializeAcct;