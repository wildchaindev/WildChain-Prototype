import React from "react";
import * as fcl from "@onflow/fcl";
//import * as t from "@onflow/types";

const DisplayAvatar = () => {
  //const [nftInfo, setNftInfo] = useState(null)
  const display = async () => {
    let test = await fcl.authz()
    //let test2 = await fcl.getAccount({value:"0xe03daebed8ca0615)", type: t.Address})
    //console.log(this.props)
    console.log(await test)
    //console.log(await test2)
    //setNftInfo(decoded)
    //console.log(nftInfo)
  };
  return (
    <div className="nft-ids">
      <div className="center">
        <button className="btn-primary" onClick={display}>Console Test</button> 
        <img src=""></img>       
    </div>
    </div>
  );
};

export default DisplayAvatar;