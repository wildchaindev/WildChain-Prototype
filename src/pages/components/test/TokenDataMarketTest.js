import React, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const TokenDataMarketTest = (props) => {
  const [nftInfo, setNftInfo] = useState(null)

  // Using this function for displaying ipfs content
  function showImg(s) {
    let arr = s.split("ipfs://");
    //console.log(arr);
    if(s.split("ipfs://").length === 2){
      let link = "https://ipfs.io/ipfs/"+arr[1];
      //console.log(link);
      return(
          <img id="gridIcon" src={link} alt="Giraffe"></img>
      )
    }
  }

  const fetchTokenData = async () => {
    let testAddr = props.account
    //console.log("Prop ID: " + props.nftID)
    let testID = parseInt(props.nftID)
    const encoded = await fcl
      .send([
        fcl.script`
        import WildNFT from 0xProfile

        pub fun main(account: Address, nftId: UInt64) : {String : String} {
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
          return receiverRef.getMetadata(id: nftId)
      }       
      `,
      fcl.args( 
        [fcl.arg(testAddr, t.Address),
        fcl.arg(testID, t.UInt64)] )
      ])
    //console.log("Data Type: " + typeof(fcl.authz()))
    //console.log(fcl.authz().addr)
    //let testVal = await fcl.authz()
    //console.log("TestVal: " + await testVal.addr)
    const decoded = await fcl.decode(encoded)
    //console.log("Decode: " + decoded)
    setNftInfo(decoded)
    //console.log("NFT Info: " + nftInfo)
    //console.log("NFT Info: " + nftInfo["uri"])
    //console.log(nftInfo)
  };

  useEffect(() => {
      fetchTokenData();
  }, [props.account,props.nftID]);

  if(nftInfo != null){
  return (
    <div className="token-data">
      {showImg(nftInfo["uri"])}
    </div>
  );
  }
  else return (<div>Img Not Found</div>)
};

export default TokenDataMarketTest;