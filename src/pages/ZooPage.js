import React from 'react' 
import sd from "../assets/img/ZooLogos/SanDiego.png";
import bronx from "../assets/img/ZooLogos/bronx.png";
import oak from "../assets/img/ZooLogos/Oakland.png";
import elm from "../assets/img/ZooLogos/Elmswood.png";
/*import { LitElement, html, customElement, property } from "lit-element";
import { useLocation } from "react-router-dom";*/

import DisplayZooGrid from './components/DisplayZooGrid';
import GetIDs from './components/GetIDs';
import ErrorBoundary from './components/ErrorBoundary';

class ZooPage extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
    }

    // Use this to display different icons depending on the logo clicked
    renderSwitch(imgTag) {
      console.log(this.props.location.state.imgSrc)
      console.log(this.props.location.state.account)
      switch(imgTag) {
        case "sd":
          return <img 
          src={sd}
          id="viewIcon"
          alt="SDZooLogo" 
          title="SDZooLogo"> 
        </img>;
        case "bronx":
          return <img 
          src={bronx} 
          id="viewIcon"
          alt="BronxZooLogo" 
          title="BronxZooLogo"> 
        </img>;
        case "oak":
          return <img 
          src={oak} 
          id="viewIcon"
          alt="OakZooLogo" 
          title="OakZooLogo"> 
        </img>;
        case "elm":
          return <img 
          src={elm} 
          id="viewIcon"
          alt="ElmZooLogo" 
          title="ElmZooLogo"> 
        </img>;
        default:
          return 'test';
      }
    }
    
    render() {
      return(
      <div>
          <h2>Zoo Page</h2>
          <div className="row">
            <div className="column">
              {this.renderSwitch(this.props.location.state.imgSrc)}  
            </div>
            <ErrorBoundary>
              <DisplayZooGrid account={this.props.location.state.account}></DisplayZooGrid>
              <GetIDs account={this.props.location.state.account}></GetIDs>
            </ErrorBoundary>
          </div>
      </div>)
    ;
    }
}

export default ZooPage;
