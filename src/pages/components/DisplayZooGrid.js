import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const DisplayZooGrid = (props) => {
  console.log("Prop Account Info: " + props.account)
  const [nftInfo, setNftInfo] = useState("")
  const display = async () => {

    const encoded = await fcl
      .send([
        fcl.script`
        import WildNFT from 0xProfile

        pub fun main(account: Address) : [String?] {
          // Account that owns the NFT. 
          // In this case, this is the same account as the one that minted the NFT and deployed the contract.
          let nftOwner = getAccount(account)
          log("NFT Owner")
          // Simply borrows all capabilities that are available by access levels as defined by the contract
          let capability = nftOwner.getCapability(/public/NFTReceiver)
      
          // Pull out the "borrow()" capability to get the script to borrow from the deployed contract
          let receiverRef = capability.borrow<&{WildNFT.NFTReceiver}>()
              ?? panic("Could not borrow the receiver reference")
      
          // At this point, we can use any functions available by capabilities as defined by the contract
          // Thus, call the getMetadata function.
          // For the sake of this test, just getting metadata for the NFT with id 1.

          var URIs: [String?] = []
          let ids = receiverRef.getIDs()
          for element in ids {
            let data = receiverRef.getMetadata(id: element)
            URIs.append(data["uri"])
          }
          return URIs
      }       
      `,
      fcl.args( 
        [fcl.arg(props.account, t.Address)]
        )
      ])
    const decoded = await fcl.decode(encoded)
    console.log("Decode: " + decoded)
    setNftInfo(decoded)
  };

  function showImg(s, rowCt) {
    let arr = s.split("ipfs://");
    if(s.split("ipfs://").length === 2){
      let link = "https://ipfs.io/ipfs/"+arr[1];
      console.log(link)
      if(rowCt === 3){
        return <br><img id="gridIcon" src={link} alt="Giraffe"></img></br>
      }
      return <img id="gridIcon" src={link} alt="Giraffe"></img>
    }   
  }
  return (
    <div className="nft-ids">
      <div className="center">
          <button className="btn-primary" onClick={display}>Grid</button> 
          {
              nftInfo &&
              <div> {
              Object.keys(nftInfo).map(k => {
                return (
                  <div class="column">{k}: 
                      {showImg(nftInfo[k], k%3)}
                  </div>
                )
              })}
              <button onClick={() => setNftInfo(null)} className="btn-secondary">Clear Grid</button>
              </div>
          }       
      </div>
    </div>
  );
};

export default DisplayZooGrid;