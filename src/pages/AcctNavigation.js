import React from 'react' 
import { useHistory } from "react-router-dom";
import sd from "../assets/img/ZooLogos/SanDiego.png";
import bronx from "../assets/img/ZooLogos/bronx.png";
import oak from "../assets/img/ZooLogos/Oakland.png";
import elm from "../assets/img/ZooLogos/Elmswood.png";

function AcctNavigation() {
    let history = useHistory();

    // When logo gets clicked, push AcctPage with tag for Account/Logo being used
    function handleClick(sourceTag, address) {
        history.push("/ZooPage", {imgSrc: sourceTag, account: address})
        //console.log(sourceTag)
    }
  
    return (
     <div>
         <div class="zoo-card">
             <button type="button">
                 <a href="/zoos/SanDiego">
                        <img 
                            src={sd} 
                            id="icon"
                            alt="SDZooLogo" 
                            title="SDZoo"> 
                        </img>
                 </a>
             </button>
             <div class="zoo-card-label">
                 <h4>San Diego Zoo</h4>
             </div>
         </div>
         <div class="zoo-card">
             <button type="button">
                 <a href="/zoos/Bronx">
                        <img 
                            src={bronx} 
                            id="icon"
                            alt="BronxZooLogo" 
                            title="BronxZoo"> 
                        </img>
                 </a>
             </button>
             <div class="zoo-card-label">
                 <h4>Bronx Zoo</h4>
             </div>
         </div>
         <div class="zoo-card">
             <button type="button">
                 <a href="/zoos/Oakland">
                    <img 
                        src={oak} 
                        id="icon"
                        alt="OakZooLogo" 
                        title="OakZoo"> 
                    </img>
                 </a>
             </button>
             <div class="zoo-card-label">
                 <h4>Oakland Zoo</h4>
             </div>
         </div>
         <div class="zoo-card">
             <button type="button">
                 <a href="/zoos/ElmwoodPark">
                    <img 
                        src={elm} 
                        id="icon"
                        alt="ElmZooLogo" 
                        title="ElmZoo"> 
                    </img>
                 </a>
             </button>
             <div class="zoo-card-label">
                 <h4>Elmwood Park Zoo</h4>
             </div>
         </div>

     </div>
    );
  }
  export default AcctNavigation;