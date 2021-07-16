import React, { useState } from 'react' 
import AcctNavigation from "./AcctNavigation";

class MainPage extends React.Component {

    constructor(props) {
      super(props);
      this.state = { };
    }
    render() {
        return(
      <div >
        <section class="welcome-title">
          <h2>Wildchain Prototype</h2>
        </section>
        <section class="navigate-by-zoos">
          <div >
            <div id="sdbutton">
              <AcctNavigation></AcctNavigation>   
            </div>
          </div>
        </section>
      </div>)
    ;
    }
}

export default MainPage;
