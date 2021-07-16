import React from 'react';
import {Link} from 'react-router-dom';
import ProfileBar from './ProfileBar';
import WildChainIcon from '../../assets/img/WildChainImgs/favicon-32x32.png';
import DisplayMintPage from './DisplayMintPage';

function NavBar() {
    return(
        <div class="topnav" id="wildTopnav">
            <ul>
                <img 
                    src={WildChainIcon} 
                    id="WCicon"
                    alt="WClogo" 
                    title="WildChainLogoLong"> 
                </img>
                <nav>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/AcctPage">Account Page</Link></li>
                    <li><Link to="/Marketplace">Marketplace</Link></li>
                    <DisplayMintPage></DisplayMintPage>
                </nav>
            </ul>
            <ProfileBar />
        </div>
    )
}

export default NavBar;