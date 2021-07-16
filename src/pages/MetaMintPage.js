import React, { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"

var current = new Date();
var dd = String(current.getDate()).padStart(2, '0');
var mm = String(current.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = current.getFullYear();
current = mm + '/' + dd + '/' + yyyy;
let stateArr = [
'author', 
'caption', 
'lang',
'dateMediaPost',
'rtCount',
'fvCount',
'idStr',
'uri',
'dateMint',
'rarity'];

class MetaMintPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            author: "Type author's name here", 
            caption:"Type Tweet's caption here",
            lang:"eng",
            dateMediaPost:"Enter Date Here",
            rtCount:"Type Tweet's retweet count here",
            fvCount:"Type Tweet's favorite count here",
            idStr: "Type Tweet's ID String here",
            uri: "Type Tweet's URI Address from IPFS here",
            dateMint: current,
            rarity: "na",
            auth: false};
      }

    Mint = async () => {
        let profile = process.env.REACT_APP_CONTRACT_PROFILE
        let code = `
        import WildNFT from 0xProfile

        transaction(customData: {String : String}) {
            // If the person executing this tx doesn't have access to the
            // resource, then the tx will fail. Thus, references...
            let receiverRef: &{WildNFT.NFTReceiver}
            let minterRef: &{WildNFT.NFTAuthMint}
        
            // ...in "prepare", the code borrows capabilities on the two resources referenced above,
            // takes in information of the person executing the tx, and validates.
            prepare(acct: AuthAccount) {
                let admin = getAccount(`+profile+`)
                self.receiverRef = acct.getCapability<&{WildNFT.NFTReceiver}>(/public/NFTReceiver)
                    .borrow()
                    ?? panic("Could not borrow receiver reference.")
    
                self.minterRef = admin.getCapability<&{WildNFT.NFTAuthMint}>(/public/AuthMint)
                    .borrow()
                    ?? panic("Could not borrow auth minter reference.")
        
                let metadata : {String : String} = customData
        
                // This is where the NFT resource itself is created
                self.minterRef.authMint(authUser: acct)
                let newNFT <- acct.load<@WildNFT.NFT>(from: /storage/MintedNFT)!
        
                // This is where the metadata comes into the picture to join with the new NFT!
                self.receiverRef.deposit(token: <-newNFT, metadata: metadata)
        
                log("NFT has been minted and deposited to Account's Collection")
            }
        }`
        /*let customData = {}
        stateArr.forEach(el => customData[el] = this.state[el])
        console.log("Dictionary Key: " + typeof(Object.keys(customData)[0]))
        console.log("Dictionary Value: " + typeof(customData["author"]))*/
        const encoded = await fcl
          .send([
            fcl.transaction`${code}`,
            fcl.proposer(fcl.authz),
            fcl.authorizations([fcl.authz]),
            fcl.payer(fcl.authz),
            fcl.limit(50),
            fcl.args( 
            [ fcl.arg(
                [{key: "author", value: this.state.author},
                {key: "caption", value: this.state.caption},
                {key: "lang", value: this.state.lang},
                {key: "dateMediaPost", value: this.state.dateMediaPost},
                {key: "rtCount", value: this.state.rtCount},
                {key: "fvCount", value: this.state.fvCount},
                {key: "idStr", value: this.state.idStr},
                {key: "uri", value: this.state.uri},
                {key: "dateMint", value: this.state.dateMint},
                {key: "rarity", value: this.state.rarity}], 
                t.Dictionary({key: t.String, value: t.String}))
            ])  
        ])     
        const decoded = await fcl.decode(encoded)
        console.log(decoded)
    };

    onInputchange(elementId) {
        let idValue = document.getElementById(elementId).value
        switch(elementId){
        case "author":
          this.setState({
            author: idValue
          });
          console.log(this.state.author);
          break
        case "caption":
          this.setState({
            caption: idValue
          });
          console.log(this.state.caption);
          break
        case "lang":
          this.setState({
            lang: idValue
          });
          console.log(this.state.lang);
          break
        case "dateMediaPost":
          this.setState({
            dateMediaPost: idValue
          });
          console.log(this.state.dateMediaPost);
          break
        case "rtCount":
          this.setState({
            rtCount: idValue
          });
          console.log(this.state.rtCount);
          break
        case "fvCount":
          this.setState({
            fvCount: idValue
          });
          console.log(this.state.fvCount);
          break
        case "idStr":
          this.setState({
            idStr: idValue
          });
          console.log(this.state.idStr);
          break
        case "uri":
          this.setState({
            uri: idValue
          });
          console.log(this.state.uri);
          break
        case "dateMint":
          this.setState({
            dateMint: idValue
          });
          console.log(this.state.dateMint);
          break
        case "rarity":
          this.setState({
            rarity: idValue
          });
          console.log(this.state.rarity);
          break
        }      
      }

    render() {
      return(
      <div>
          <h2>Metadata Minting Page</h2>
          <div class="pageCenter" id="pageCenter">
                <div class="metaEnter" id="WildMetaEnter">
                    <label form="author">Author:</label>
                    <input 
                        type="text" 
                        id="author" 
                        name="author" 
                        value={this.state.author}
                        onChange={() => this.onInputchange("author")}></input>
                    <br></br>
                    <label form="caption">Caption:</label>
                    <input 
                        type="text" 
                        id="caption" 
                        name="caption" 
                        value={this.state.caption}
                        onChange={() => this.onInputchange("caption")}></input>
                    <br></br>
                    <label form="lang">Language:</label>
                    <select 
                    name="lang" 
                    id="lang" 
                    value={this.state.lang}
                    onChange={() => this.onInputchange("lang")}>
                        <option value="eng">English</option>
                        <option value="span">Español</option>
                        <option value="fren">Francais</option>
                        <option value="kor">한국어</option>
                    </select>
                    <br></br>
                    <label form="dateMediaPost">Date Media Posted:</label>
                    <input 
                        type="text" 
                        id="dateMediaPost" 
                        name="date-media" 
                        value={this.state.dateMediaPost}
                        onChange={() => this.onInputchange("dateMediaPost")}></input>
                    <br></br>
                    <label form="rtCount">Retweet Count:</label>
                    <input 
                        type="text" 
                        id="rtCount" 
                        name="rtCount" 
                        value={this.state.rtCount}
                        onChange={() => this.onInputchange("rtCount")}></input>
                    <br></br>
                    <label form="fvCount">Favorite Count:</label>
                    <input 
                        type="text" 
                        id="fvCount" 
                        name="fvCount" 
                        value={this.state.fvCount}
                        onChange={() => this.onInputchange("fvCount")}></input>
                    <br></br>
                    <label form="idStr">ID String:</label>
                    <input 
                        type="text" 
                        id="idStr" 
                        name="idStr" 
                        value={this.state.idStr}
                        onChange={() => this.onInputchange("idStr")}></input>
                    <br></br>
                    <label form="uri">URI Address:</label>
                    <input 
                        type="text" 
                        id="uri" 
                        name="uri" 
                        value={this.state.uri}
                        onChange={() => this.onInputchange("uri")}></input>
                    <br></br>
                    <label form="dateMint">Date NFT Minted:</label>
                    <input 
                        type="text" 
                        id="dateMint" 
                        name="dateMint" 
                        value={this.state.dateMint}
                        onChange={() => this.onInputchange("dateMint")}></input>
                    <br></br>
                    <label form="rarity">Rarity Level:</label>
                    <select 
                    name="rarity" 
                    id="rarity"
                    value={this.state.rarity}
                    onChange={() => this.onInputchange("rarity")}>
                        <option value="na">Select Rarity</option>
                        <option value="low">Low Rarity</option>
                        <option value="med">Medium Rarity</option>
                        <option value="high">High Rarity</option>
                        <option value="max">Extreme Rarity</option>
                    </select>
                    <br></br>
                </div>
                <button onClick={this.Mint}>Mint</button>
          </div>
      </div>)
    ;
    }
}

export default MetaMintPage;
