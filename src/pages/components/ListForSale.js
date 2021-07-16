import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"

const ListForSale = () => {
  const [status, setStatus] = useState("Not Started")
  const sell = async () => {
    let metaID = parseInt(document.getElementById("acctNftIDMeta").value)
    let price = document.getElementById("acctNftPrice").value
    const encoded = await fcl
    .send([
        fcl.transaction`
        import WildNFT,WildCoin,Marketplace from 0xProfile

// Transaction that "posts an NFT on the marketplace as for sale" by:
// creating a sale collection, 
// withdrawing an NFT from the receiver account, 
// and calling the Marketplace function to emit the ForSale event
// and post the NFT with its price on the site. 

transaction(nftID: UInt64, salePrice: UFix64){

  prepare(acct: AuthAccount) {
      let receiver = acct.getCapability<&{WildCoin.Receiver}>(/public/Vault)

      //let sale = acct.borrow<&Marketplace.SaleCollection>(from: /storage/NFTSale)
      let sale <- acct.load<@Marketplace.SaleCollection>(from: /storage/NFTSale)!
      let collectionRef = acct.borrow<&WildNFT.Collection>(from: /storage/WildNFTCollection)
          ?? panic("Could not borrow owner's nft collection reference")

      let token <- collectionRef.withdraw(withdrawID: nftID)

      sale.listForSale(token: <-token, price: salePrice, metadata: collectionRef.metadataObjs.remove(key: nftID)!)

      acct.save(<-sale, to: /storage/NFTSale)

      //acct.link<&Marketplace.SaleCollection{Marketplace.SalePublic}>(/public/NFTSale, target: /storage/NFTSale)

  }
}
      `,
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.payer(fcl.authz),
      fcl.limit(50),
      fcl.args( 
        [ fcl.arg(metaID, t.UInt64),
          fcl.arg(price, t.UFix64)] )
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
    <div className="sell-nft">
        <div className="center">
        <div className="fancy">
        <div className="center">
            <button className="btn-primary" onClick={sell}>List For Sale</button>  
            <div>
              {status}
            </div>      
        </div>
        </div>
        </div>
    </div>
  );
};

export default ListForSale;