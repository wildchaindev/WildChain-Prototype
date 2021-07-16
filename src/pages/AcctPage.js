import React from 'react' 
/*import sd from "../assets/img/ZooLogos/SanDiego.png";
import bronx from "../assets/img/ZooLogos/bronx.png";
import oak from "../assets/img/ZooLogos/Oakland.png";
import elm from "../assets/img/ZooLogos/Elmswood.png";
import { LitElement, html, customElement, property } from "lit-element";
import { useLocation } from "react-router-dom";*/

import ViewBalance from './components/ViewBalance';
import InitializeAcct from './components/InitializeAcct';
import DisplayNFTGrid from './components/DisplayNFTGrid';
import ListForSale from './components/ListForSale';


class AcctPage extends React.Component {

    constructor(props) {
      super(props);
      this.state = {nftIDMeta: "1", price:"10.0"};
    }

    onInputchange(elementId) {
      let idValue = document.getElementById(elementId).value
      switch(elementId){
      case "acctNftIDMeta":
        this.setState({
          nftIDMeta: idValue
        });
        break
      case "acctNftPrice":
        this.setState({
          price: idValue
        });
        break
      }
    }
    
    render() {
      return(
      <div>
          <h2>Account Page</h2>
          <div className="row">
            <div className="column">
              <InitializeAcct></InitializeAcct>
            <div className="center">
            <div className="fancy">
            <div className="center">
            <label form="acctNftIDMeta" className="mt-3"><b>NFT ID</b></label><br/>
                    <input
                      type="text"
                      id="acctNftIDMeta"
                      data-field="id"
                      value={this.state.nftIDMeta}
                      onChange={() => this.onInputchange("acctNftIDMeta")}/><br/>
            <label form="acctNftPrice" className="mt-3"><b>NFT Price</b></label><br/>
                    <input
                      type="text"
                      id="acctNftPrice"
                      data-field="id"
                      value={this.state.price}
                      onChange={() => this.onInputchange("acctNftPrice")}/>
            <ListForSale></ListForSale>
            </div>
            </div>
            </div>
            </div>
            <div className="row">
              <div className="column">
                <DisplayNFTGrid></DisplayNFTGrid>
              </div>
              <div className="column">
                <ViewBalance></ViewBalance>
              </div>
            </div>
          </div>
      </div>)
    ;
    }
}

export default AcctPage;
