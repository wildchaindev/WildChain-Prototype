import React, { useEffect, useState } from "react";
import * as sdk from "@onflow/sdk";
import TokenDataMarketTest from "../TokenDataMarketTest";

// Mainnet Access Node
const node = "https://access-testnet.onflow.org";
const EVENT_MOMENT_LISTED = "A.1e9bb4b5d4200765.Marketplace.ForSale";
const FETCH_INTERVAL = 1000;


// since last block returned is not sealed
// we will go back a bit back in time
var SHIFT = 200;
let isSealed = false;
let displayAmount = 2;

function union(setA, setB) {
  var _union = new Set(setA);
  for (var elem of setB) {
    _union.add(elem);
  }
  return _union;
}

export default function MarketTest() {
  const [lastBlock, setLastBlock] = useState(0);
  const [eventIDs, setEventIdS] = useState(new Set());
  const [eventsDictionary, setEventsDictionary] = useState({});

  const fetchEvents = async (height) => {
    console.log("Fetching Block");
    if (height == 0) {
    const latestBlock = await sdk.send(
      await sdk.build([sdk.getBlock(isSealed)]),
      {
        node
      }
    );
    //console.log(latestBlock);
    height = latestBlock.block.height;
    }
    console.log(lastBlock);
    console.log("Events Found: " + Object.keys(eventsDictionary).length)
    let end = height;
    let start = height-SHIFT;

    // fetch events
    const response = await sdk.send(
      await sdk.build([sdk.getEventsAtBlockHeightRange(EVENT_MOMENT_LISTED, start, end)]),
      { node }
    );

    const { events } = response;

    if (events.length > 0) {
      const newSet = new Set(
        events.map((event) => {
          const id = event.payload.value.fields[0].value.value;
          eventsDictionary[id] = event;
          return id;
        })
      );
      const newEvents = union(eventIDs, newSet);
      setEventsDictionary(eventsDictionary);
      setEventIdS(newEvents);
    }

    // update last processed block
    setLastBlock(start);
  };

  useEffect(() => {
    if(Object.keys(eventsDictionary).length < displayAmount){
      const interval = setInterval(fetchEvents(lastBlock), FETCH_INTERVAL);
      return () => {
        clearInterval(interval);
      };
    }
  });

  const events = Array.from(eventIDs);

  return (
    
    <div className="Marketplace">
      {console.log("Memory Test")}
      <p>
        Latest processed block: <b>#{lastBlock}</b>
      </p>
      <p>
        Events found: <b>{events.length}</b>
      </p>
      <table className="styled-table">
        <thead>
          <tr>
            <th align="left">NFT ID</th>
            <th align="left">Seller</th>
            <th align="left">Price</th>
            <th align="left">Metadata</th>
          </tr>
        </thead>
        <tbody>
          {events.map((eventId) => {
            const event = eventsDictionary[eventId];
            const payload = event.payload.value.fields;
            const [id, price, seller] = payload;
            const nftId = id.value.value;
            const nftPrice = price.value.value;
            const nftSeller = seller.value.value.value;
            const nftMetadata = <TokenDataMarketTest account={nftSeller} nftID={nftId}></TokenDataMarketTest>
            return (
              <tr>
                <td align="left">#{nftId}</td>
                <td align="left">#{nftSeller}</td>
                <td align="left">#{nftPrice}</td>
                <td align="left">{nftMetadata}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
