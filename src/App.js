import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import './App.css';
import MainPage from './pages/MainPage';
import AcctPage from './pages/AcctPage';
import ZooPage from './pages/ZooPage';
import Marketplace from './pages/Marketplace';
import MetaMintPage from './pages/MetaMintPage';
import NavBar from './pages/components/NavBar';
import Footer from './pages/components/Footer';
import SanDiegoZoo from './pages/zoopages/SanDiegoZoo';
import BronxZoo from './pages/zoopages/BronxZoo';
import ElmZoo from './pages/zoopages/ElmwoodParkZoo';
import OakZoo from './pages/zoopages/OaklandZoo';

function App() {
  const [auth, setAuth] = useState(false)
  const checkAccount = async () => {
    let snapshot = await fcl.currentUser().snapshot()
    console.log("Snapshot: " + snapshot)
    let addrVal = await snapshot.addr
    console.log("addrVal: " + addrVal)
    let profile = process.env.REACT_APP_CONTRACT_PROFILE
    let code =`
    import WildNFT from 0xProfile
  
    pub fun main(addr: Address) : Bool {
    let account = getAccount(`+profile+`)
    let capability = account.getCapability(/public/AccessList) 
    let ref = capability.borrow<&{WildNFT.NFTMinterAccessPub}>() 
        ?? panic("Could not borrow account access list reference")
    let minterList = ref.getAccounts()

    return minterList.contains(addr)
  }`
    if(addrVal != null){
    const encoded = await fcl
      .send([
        fcl.script`${code}`,fcl.args( 
        [fcl.arg(addrVal, t.Address)])
      ])
      const decoded = await fcl.decode(encoded)
      console.log("Mint Auth: " + decoded)
      setAuth(decoded)
    }
  };
  useEffect(() => {
  checkAccount();
  }, [auth]);

  return (
    <div className="App">
      <NavBar />
      <Route exact path="/" component={MainPage}></Route>
      <Route exact path="/Marketplace" component={Marketplace}></Route>
      <Route exact path="/AcctPage" render={(props) => <AcctPage globalStore={"test"} {...props} /> }></Route>
      <Route exact path="/ZooPage" component={ZooPage}></Route>
      <Route exact path="/MetaMintPage" render = {() => (auth ? (<MetaMintPage/>) : (<Redirect to="/" />))}></Route>
      <Route exact path="/zoos/SanDiego" component={SanDiegoZoo}></Route>
      <Route exact path="/zoos/ElmwoodPark" component={ElmZoo}></Route>
      <Route exact path="/zoos/Oakland" component={OakZoo}></Route>
      <Route exact path="/zoos/Bronx" component={BronxZoo}></Route>
      <Footer />
    </div>
  );
}
export default App;