import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const GetIDs = (props) => {
  const [nftInfo, setNftInfo] = useState(null)
  const fetchTokenData = async () => {
    const encoded = await fcl
      .send([
        fcl.script`
        
        import WildNFT from 0xProfile

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
      `,
      fcl.args( [fcl.arg(props.account, t.Address)] )
      ])
    
    const decoded = await fcl.decode(encoded)
    setNftInfo(decoded)
    //console.log(nftInfo)
  };
  return (
    <div className="nft-ids">
      <div className="center">
        <button className="btn-primary" onClick={fetchTokenData}>Get NFT IDs</button>        
      {
        nftInfo &&
        <div>
          {
            Object.keys(nftInfo).map(k => {
              return (
                <p>{k}: {nftInfo[k]}</p>
              )
            })
          }
          <div className="center">
            <button onClick={() => setNftInfo(null)} className="btn-secondary">Clear ID Info</button>
          </div>
        </div>
      }
      </div>
    </div>
  );
};

export default GetIDs;