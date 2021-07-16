import React from 'react' 

import MarketGrid from './components/MarketGrid';

class Marketplace extends React.Component {

    constructor(props) {
        super(props);
        this.state = { };
      }
      render() {
          return(
        <div>
            <h2>Marketplace</h2>
                <MarketGrid></MarketGrid>   
        </div>)
      ;
      }
}

export default Marketplace;