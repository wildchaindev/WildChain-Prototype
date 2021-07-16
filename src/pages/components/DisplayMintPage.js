import React, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import {Link} from 'react-router-dom';

const DisplayMintPage = () => {
const [mintUsers, setMintUsers] = useState(false)

const checkAccount = async () => {
    let snapshot = await fcl.currentUser().snapshot()
    console.log("Snapshot: " + snapshot)
    let addrVal = await snapshot.addr
    console.log("addrVal: " + addrVal)
    let profile = process.env.REACT_APP_CONTRACT_PROFILE
    let code = `
    import WildNFT from 0xProfile

    pub fun main(addr: Address) : Bool {
    let account = getAccount(`+profile+`)
    let capability = account.getCapability(/public/AccessList) 
    let ref = capability.borrow<&{WildNFT.NFTMinterAccessPub}>() 
        ?? panic("Could not borrow account access list reference")
    let minterList = ref.getAccounts()

    return minterList.contains(addr)
  }`
    if(addrVal != null){
    const encoded = await fcl
      .send([
        fcl.script`${code}`,fcl.args( 
        [fcl.arg(addrVal, t.Address)])
      ])
      const decoded = await fcl.decode(encoded)
      console.log("Decode: " + decoded)
      setMintUsers(decoded)
    }
};
useEffect(() => {
  checkAccount();
}, [mintUsers]);
if(mintUsers){
  console.log("User Approved")
  return (
    <li><Link to={{
      pathname: "/MetaMintPage", 
      state: {auth: true}
    }}>Mint an NFT</Link></li>
  )
}
else{
  return null
}
};

export default DisplayMintPage;