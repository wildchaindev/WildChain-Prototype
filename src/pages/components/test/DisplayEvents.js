import React, { useEffect, useState } from "react";
import * as sdk from "@onflow/sdk";

// Mainnet Access Node
const node = "http://localhost:8080";
const EVENT_MOMENT_LISTED = "A.f8d6e0586b0a20c7.Marketplace.ForSale";
const FETCH_INTERVAL = 1000;

// since last block returned is not sealed
// we will go back a bit back in time
var SHIFT = 10;
let isSealed = false

function union(setA, setB) {
  var _union = new Set(setA);
  for (var elem of setB) {
    _union.add(elem);
  }
  return _union;
}

export default function DisplayEvents() {
  const [lastBlock, setLastBlock] = useState(0);
  const [eventIDs, setEventIdS] = useState(new Set());
  const [eventsDictionary, setEventsDictionary] = useState({});

  const fetchEvents = async () => {
    const latestBlock = await sdk.send(
      await sdk.build([sdk.getBlock(isSealed)]),
      {
        node
      }
    );

    const height = latestBlock.block.height - SHIFT;
    let end = height;
    let start = lastBlock;
    if (lastBlock === 0) {
      start = height;
    }

    if (SHIFT > 0) {
        SHIFT-=1;
    }


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
    setLastBlock(height);
  };

  useEffect(() => {
    const interval = setInterval(fetchEvents, FETCH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  });

  const events = Array.from(eventIDs);

  return (
    <div className="Marketplace">
      <p>
        Latest processed block: <b>#{lastBlock}</b>
      </p>
      <p>
        Events found: <b>{events.length}</b>
      </p>
      <table align="center">
        <thead>
          <tr>
            <th align="left">NFT ID</th>
            <th align="right">Seller</th>
            <th align="right">Price</th>
          </tr>
        </thead>
        <tbody>
          {events.map((eventId) => {
            const event = eventsDictionary[eventId];
            const payload = event.payload.value.fields;
            const [id, price, seller] = payload;
            console.log(seller)
            const nftId = id.value.value;
            const nftPrice = price.value.value;
            const nftSeller = seller.value.value.value;
            return (
              <tr>
                <td align="left">#{nftId}</td>
                <td align="right">#{nftSeller}</td>
                <td align="right">#{nftPrice}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
