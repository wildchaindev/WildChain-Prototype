import React, { useEffect, useState } from "react";
import * as sdk from "@onflow/sdk";
import Modal from 'react-modal';
import TokenDataMarketSell from "./TokenDataMarketSell";
import Purchase from "./PurchaseNFT";

// Testnet Access Node
const node = "https://access-testnet.onflow.org";
const EVENT_MOMENT_LISTED = "A."+process.env.REACT_APP_CONTRACT_PROFILE.replace("0x","")+".Marketplace.ForSale";
const FETCH_INTERVAL = 1000;

var SHIFT = 200;
let isSealed = false;
let displayAmount = 9;

function union(setA, setB) {
  var _union = new Set(setA);
  for (var elem of setB) {
    _union.add(elem);
  }
  return _union;
}

export default function MarketGrid() {
  const [lastBlock, setLastBlock] = useState(0);
  const [eventIDs, setEventIdS] = useState(new Set());
  const [eventsDictionary, setEventsDictionary] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [displaySeller, setSeller] = useState("");
  const [displayPrice, setPrice] = useState("");
  const [displayId, setId] = useState("");
  const [displayMetadata, setMetadata] = useState(null);

  Modal.setAppElement(document.getElementById('marketplace'));

  function openModal(seller, price, id, metadata) {
    //displaySeller = seller;
    //displayPrice = price;
    setSeller(seller);
    setPrice(price);
    setId(id);
    setMetadata(metadata);
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  function loadMarket() {
    if (events.length < displayAmount){
      return <div>Loading Marketplace...</div>
    }
  }

  const fetchEvents = async (height) => {
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
    //console.log(lastBlock);
    //console.log("Events Found: " + Object.keys(eventsDictionary).length)
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
    
    <div id="marketplace" className="Marketplace">
      {console.log("Memory Test")}
      <div className="center">
        <div className="row">
      {loadMarket()}
      {events.map((eventId) => {
            const event = eventsDictionary[eventId];
            const payload = event.payload.value.fields;
            const [id, price, seller] = payload;
            const nftId = id.value.value;
            const nftPrice = price.value.value;
            //console.log(nftPrice);
            const nftSeller = seller.value.value.value;
            const nftMetadata = <TokenDataMarketSell account={nftSeller} nftID={nftId}></TokenDataMarketSell>
            return (
              <div className="column"><button onClick={() => openModal(nftSeller,nftPrice, nftId, nftMetadata)}>
                {nftMetadata}
              </button>
              <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
              >
                <h2>NFT</h2>
                <button onClick={closeModal}>close</button>
                <Purchase sellerAcct={displaySeller} nftID={displayId} tokenAmount={displayPrice}></Purchase>
                <div>
                  {displayMetadata}
                  <div className="column">
                    Seller: {displaySeller}
                    <br/>
                    Price: {displayPrice}
                    <br/>
                    ID: {displayId}
                  </div>
                </div>
              </Modal></div>
            );
          })
        }
          </div>
      </div>     
    </div>
  );
}
