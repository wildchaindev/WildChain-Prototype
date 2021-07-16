import React, { useState } from "react";
import * as fcl from "@onflow/fcl";

const DeleteResources = () => {
  const [status, setStatus] = useState("Not Started")
  const initialize = async () => {
    const encoded = await fcl
      .send([
        fcl.transaction`
        import WildNFT,WildCoin,Marketplace from 0xProfile

        transaction {
          prepare(acct: AuthAccount) {
      
              // Delete any existing collection
              let existing <- acct.load<@WildNFT.Collection>(from: /storage/WildNFTCollection)!
              destroy existing
              let existingVault <- acct.load<@WildCoin.Vault>(from: /storage/MainVault)!
              destroy existingVault
              let existingSale <- acct.load<@Marketplace.SaleCollection>(from: /storage/NFTSale)!
              destroy existingSale
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
            <button className="btn-primary" onClick={initialize}>Delete Resources</button>  
            <div>
              {status}
            </div>      
        </div>
        </div>
        </div>
    </div>
  );
};

export default DeleteResources;