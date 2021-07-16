import React, {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import * as fcl from "@onflow/fcl"


function unauthenticate(history) {
  fcl.unauthenticate();
  history.push("/",{});
  window.location.reload()
}

const AuthCluster = () => {
  let history = useHistory();
  const [user, setUser] = useState({loggedIn: null})
  useEffect(() => fcl.currentUser().subscribe(setUser), [])
  if (user.loggedIn) {
    return (
      <div>
        <span>{user?.addr ?? "No Address"}</span>
        <button className="btn btn-outline-primary" onClick={() => unauthenticate(history)}>Log Out</button>
      </div>
    )
  } else {
    return (
      <div>
        <button className="btn btn-outline-primary" onClick={fcl.logIn}>Log In</button>
        <button className="btn btn-outline-secondary" onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }
}

export default AuthCluster