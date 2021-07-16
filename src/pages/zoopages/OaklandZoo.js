import React from 'react' 
import oak from "../../assets/img/ZooLogos/Oakland.png";
/*import { LitElement, html, customElement, property } from "lit-element";
import { useLocation } from "react-router-dom";*/

import DisplayZooGrid from '../components/DisplayZooGrid';
import GetIDs from '../components/GetIDs';
import ErrorBoundary from '../components/ErrorBoundary';

class OaklandZoo extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
    }
    
    render() {
      return(
        <div>
            <img 
                src={oak} 
                id="viewIcon"
                alt="OakZooLogo" 
                title="OakZooLogo"> 
            </img>
          <h2>Oakland Zoo Page</h2>
          <div className="row">
              <ErrorBoundary>
                <DisplayZooGrid account={"0x117dfbf6be9cac04"}></DisplayZooGrid>
                <GetIDs account={"0x117dfbf6be9cac04"}></GetIDs>
              </ErrorBoundary>
          </div>
        </div>
        );
    }
}

export default OaklandZoo;
