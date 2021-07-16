import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

const TokenDataMarket = () => {

  const [setTokensToSell, setTokensToSell] = useState([]);

  useEffect(() => {    
    checkMarketplace()
  }, []);

  const checkMarketplace = async () => {
    try {
      const encoded = await fcl.send([
        fcl.script`
       import Marketplace from ACCOUNT
        pub fun main(): [UInt64] {
            let account1 = getAccount(ACCOUNT)
            let acct1saleRef = account1.getCapability<&AnyResource{Marketplace.SalePublic}>(/public/NFTSale)
                .borrow()
                ?? panic("Could not borrow acct2 nft sale reference")
            return acct1saleRef.getIDs()
        }
        `
      ]);
      const decoded = await fcl.decode(encoded);
      console.log(decoded); 
    } catch (error) {
      console.log("NO NFTs FOR SALE")
    }    

    for (const id of decoded) {
      const encodedMetadata = await fcl.send([
        fcl.script`
          import WildNFT from ACCOUNT
          pub fun main(id: Int) : {String : String} {
            let nftOwner = getAccount(ACCOUNT)  
            let capability = nftOwner.getCapability<&{WildNFT.NFTReceiver}>(/public/NFTReceiver)
            let receiverRef = capability.borrow()
                ?? panic("Could not borrow the receiver reference")
            return receiverRef.getMetadata(id: ID)
          }
        `,
        fcl.args([
          fcl.arg(id, t.Int)    
        ]),
      ]);
  
      const decodedMetadata = await fcl.decode(encodedMetadata);
      const encodedPrice = await fcl.send([
        fcl.script`
          import Marketplace from ACCOUNT
          pub fun main(id: UInt64): UFix64? {
              let account1 = getAccount(ACCOUNT)
              let acct1saleRef = account1.getCapability<&AnyResource{Marketplace.SalePublic}>(/public/NFTSale)
                  .borrow()
                  ?? panic("Could not borrow acct nft sale reference")
              return acct1saleRef.idPrice(tokenID: id)
          }
        `, 
        fcl.args([
          fcl.arg(id, t.UInt64)
        ])
      ])
      const decodedPrice = await fcl.decode(encodedPrice)
      decodedMetadata["price"] = decodedPrice;
      marketplaceMetadata.push(decodedMetadata);
      marketplaceMetadata.push(decodedMetadata);
    }
    console.log(marketplaceMetadata);
    setTokensToSell(marketplaceMetadata);
  }

  return (
    <div className="token-data">
      {
        tokensToSell.map(token => {
          return (
            // Use token.[field] here for displaying all metadata.
            // Examples: 
            // token.name, 
            // token.[whatever metadata field we associated with the NFT when initially minting of the NFT], 
            // token.price,
            // token["uri"] for media, e.g. from pinata: <source src={`https://ipfs.io/ipfs/${token["uri"].split("://")[1]}`} type="video/mp4" />
          )
        })
      }
      
    </div>
  );
};

export default TokenDataMarket;