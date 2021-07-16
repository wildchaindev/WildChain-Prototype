import React from 'react' 
import sd from "../../assets/img/ZooLogos/SanDiego.png";
/*import { LitElement, html, customElement, property } from "lit-element";
import { useLocation } from "react-router-dom";*/

import DisplayZooGrid from '../components/DisplayZooGrid';
import GetIDs from '../components/GetIDs';
import ErrorBoundary from '../components/ErrorBoundary';

class SanDiegoZoo extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
    }
    
    render() {
      return(
        <div>
            <img 
                src={sd}
                id="viewIcon"
                alt="SDZooLogo" 
                title="SDZooLogo"> 
            </img>
          <h2>San Diego Zoo Page</h2>
          <div className="row">
              <ErrorBoundary>
                <DisplayZooGrid account={"0xdea84ad2aee9572d"}></DisplayZooGrid>
                <GetIDs account={"0xdea84ad2aee9572d"}></GetIDs>
              </ErrorBoundary>
          </div>
        </div>
        );
    }
}

export default SanDiegoZoo;
