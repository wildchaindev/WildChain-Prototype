import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const GetIDs = () => {
  const [balanceInfo, setBalanceInfo] = useState(null)
    const fetchTokenData = async () => {
      let test = await fcl.currentUser().snapshot()
      let addrVal = await test.addr
    const encoded = await fcl
      .send([
        fcl.script`
        import WildCoin from 0xProfile

        pub fun main(account: Address) : UFix64?{

        // Get both public account objects
        let account1 = getAccount(account)

        // Find the public Receiver capability for their Collections
        let acct1Capability = account1.getCapability(/public/Vault)

        // borrow references from the capabilities
        let acct1Ref = acct1Capability.borrow<&WildCoin.Vault>()
            ?? panic("Could not borrow account 1 Vault reference")

        return acct1Ref.balance
        }          
      `,
      fcl.args( [fcl.arg(addrVal, t.Address)] )
      ])
    
    const decoded = await fcl.decode(encoded)
    setBalanceInfo(decoded)
    //console.log(nftInfo)
  };
  return (
    <div className="nft-ids">
        <div className="center">
            <button className="btn-primary" onClick={fetchTokenData}>Get Balance</button>        
        </div>
        <div>
            { balanceInfo && 
            <div>
                <button onClick={() => setBalanceInfo(null)} className="btn-secondary">Clear ID Info</button>
                <p>Balance: {balanceInfo}</p>
            </div> }
        </div>
    </div>
  );
};

export default GetIDs;