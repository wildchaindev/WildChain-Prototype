import React, {useState} from "react"
import * as fcl from "@onflow/fcl"
 
export default function TransactionOne() {
  const [status, setStatus] = useState("Not Started")
  const runTransaction = async e => {
    e.preventDefault()
    setStatus("Resolving...")
 
    const response = await fcl.send([
      fcl.transaction`
        transaction {
          execute {
            log("A transaction happened")
          }
        }
      `,
      fcl.proposer(fcl.currentUser().authorization),
      fcl.payer(fcl.currentUser().authorization),
    ])
    
    setStatus("Transaction Sent, Waiting for Confirmation")
 
    const unsub = fcl.tx(response).subscribe(transaction => {
      if (fcl.tx.isSealed(transaction)) {
        setStatus("Transaction Confirmed: Is Sealed")
        unsub()
      }
    })
  }
 
  return (
    <div>
      <button className="btn-primary" onClick={runTransaction}>Run Transaction</button>
      <div>
        {status}
      </div>
    </div>
  )
}