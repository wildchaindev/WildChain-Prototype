# Welcome!

## An Intro to The WildChain Prototype
The goal of this WildChain prototype is to become an NFT Marketplace where zoos and museums can post and sell NFTs associated with popular zoo or museum media, and a place where users can engage in trade and community. The website that is currently in development here will enable users to buy and trade these NFTs on the Flow blockchain, and will allow zoo partners to post NFTs with associated custom metadata and monitor their status on the marketplace. The previous version of this prototype was built on Decentology, but this current version is built from the ground-up using Create React App. 

## Where to Start
This repository contains all the code necessary to run our current WildChain marketplace website prototype. If you only want a view-only demo of the webpage, simply run `yarn start` in the terminal when in the repository directory. Please note that if you run like this without setting up your account configuration, requests like "Get Grid" or "Get ID" will return errors.<br/><br/>
Thus, if you would like a more interactive demo of our marketplace prototype, you can follow the setup instructions below for running this code on the Testnet configuration, our most current testing environment on the Flow blockchain. These steps include generating your own Testnet account with a private key using the Flow faucet, and pasting that private key into your flow.json configuration. You can then log into the Blocto wallet, our current wallet provider of choice. <br/><br/>
Setup instructions for running our prototype on the previous testing setup with the Flow emulator are also further below, after our development notes on issues and goals we hope to address in the future.<br/><br/>
Note: Currently, all our custom contracts as seen in the "src/cadence/contracts" directory have been initially deployed to one of our personal developer accounts.

# Setup Steps for Testnet Configuration

### 1. Install the Flow CLI

Before you start, install the [Flow command-line interface (CLI)](https://docs.onflow.org/flow-cli).

### 2. Clone the project 

```sh
git clone https://github.com/wildchaindev/WildChain-Prototype.git
```

### 3. Configuration

While in the project directory, run these commands on the terminal:

```sh
touch .env.local  
```

```sh      
touch ./src/config.js
```
#### File Contents

In config.js, place the following code:

```js
// File: ./src/config.js

import {config} from "@onflow/fcl"

config()
  .put("accessNode.api", process.env.REACT_APP_ACCESS_NODE) // Configure FCL's Access Node
  .put("challenge.handshake", process.env.REACT_APP_WALLET_DISCOVERY) // Configure FCL's Wallet Discovery mechanism
  .put("0xProfile", process.env.REACT_APP_CONTRACT_PROFILE) // Will let us use `0xProfile` in our Cadence
```

We will modify .env.local in the next step.

### 4. Create a Flow Testnet account

#### Generate a new key pair with the Flow CLI:

```sh
flow keys generate
```

_⚠️ Save these keys in a safe place!_

#### Create your account:

Go to the [Flow Testnet Faucet](https://testnet-faucet-v2.onflow.org/) to create a new account. Use the **public key** from the previous step.

#### Save your keys:

After your account has been created, return to the .env.local file
and place the following code, replacing ADDRESS_HERE with the address
created on the [Flow Testnet Faucet](https://testnet-faucet-v2.onflow.org/):

```
# File: .env.local

# ACCESS_NODE will be the endpoint our application
# will use to talk to the Flow blockchain.
REACT_APP_ACCESS_NODE=https://access-testnet.onflow.org

# WALLET_DISCOVERY will be the endpoint our application
# will use to discover available FCL compatible wallets.
REACT_APP_WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn

# CONTRACT_PROFILE will be the address that has the Profile
# smart contract we will be using in this guide.
REACT_APP_CONTRACT_PROFILE=ADDRESS_HERE
```
In flow.json should be the following:

```json
"test-account": {
      "address": "ADDRESS_HERE",
	"keys": "PRIVATE_KEY_HERE"
}
```

Replace ADDRESS_HERE with your account address with the 0x removed and
PRIVATE_KEY_HERE <br/>with the private key from ```flow keys generate``` 

### 5. Deploy the contracts

Run the testConfig.sh script with:
```sh
bash testConfig.sh
```

Deploy contracts with:
```sh
flow project deploy --network=testnet
```

**Notes Before Running:**<br/>
- ~~REACT_APP_CONTRACT_PROFILE doesn't work if included in cadence file imports. Definitely something we can look into so we don't have to keep hardcoding the admin account. <br/>Current address our dev account is using: 0x6acb059f25fc7ba2 (in case you would like to look for all hardcoded instances.)<br/>~~ Edit: Using testConfig.sh to see if it can deal with this.<br/>
- ~~MarketGrid.js also has a "hardcoded" admin address in EVENT_MOMENT_LISTED. <br/>If using your own admin account, be sure to change the address.<br/>~~ Edit: This should be fixed, but leaving this in case any issues occur due to the change.<br/>
- Ensure flow.json has admin account included, as well as the correct contracts in "deployment" for the account<br/>
- Either `npm install` or `yarn install` to be sure all packages are up-to-date.<br/>

# Running the Project

**While in project directory on terminals:**<br />
- In one terminal window, run:<br />
`yarn start`

- In another terminal window, run your flow commands.

**Notes After Running:**<br/>
- Be sure to initialize an account with the Initialize Button on the account page if you want to send/receive NFTs and WildCoins.<br/>
- If using a new test-account address, be sure to put NFTs up for sale through the flow-cli so that Markeplace has NFTs to view<br/>
Ex:<br/> 
  - Mint NFT<br/> 
  ```flow transactions send ./src/cadence/transactions/mint_metadata.cdc --signer test-account --network testnet```<br/>
  - List NFT<br/>
  ```flow transactions send ./src/cadence/transactions/list_NFT.cdc --signer test-account --network testnet --arg UInt64:1 --arg UFix64:10.00```<br/>
- For a non-admin account to have minting rights, the account must be authorized by the admin account.<br/>
Ex:<br/>
  - Add Authorized Account<br/>
  ```flow transactions send ./src/cadence/transactions/add_minter_account.cdc --signer test-account --network testnet --arg Address:0xAccount```<br/>
- If an account has been authorized to mint NFTs, they can mint their own custom NFTs and list them for sale on the Account Page.<br/>

  
# Issues to Address
- Error Handling (When an account doesn’t hold an NFT or isn’t initialized)<br/>
- Memory Leaks (specifically in Marketplace page?)<br/>
- Test Invalid Inputs( Price, ID, etc.)<br/>
- Accessing Minting Page (Can “auth” state be modified?)<br/>
- User buying their own NFT (redundant, should be disabled to avoid accidental coin burning)<br/>
- Marketplace Grid layout when less than 4 NFTs are being displayed

# Future Back-end Features
- Filter based on rating<br/>
- Display Initialize Button only if account hasn’t been initialized<br/>
- Zoo Mint NFT page (Working on accessing Minter Resource)<br/>
- Batch Minting<br/>
- Load more listings on scroll<br/>
- Faster Marketplace loading time of NFTs on the chain<br/>
- Removing authorized accounts

# Future Front-end Features
## Design
- More descriptive labeling
  - Information on NFTs viewable when they're just a preview on Marketplace or a user's own Collection
  - "Caption" style text that helps the user navigate the website
  - Focus branding on a message that will catch our target audience, try out some different slogan phrases on the home page
- Extensive search/filter features:
  - Categories/keywords:
    - By zoo
    - By animal / content
    - By price
    - By rarity
    - By media platform
  - Types of search:
    - Search bar
      - User types into it
      - Results matching what is typed pop up below, and are updated as each letter is typed
      - Can have filters by above categories/keywords
    - Large content blocks / buttons
      - Each correspond to a category or subcategories, e.g. a block to access San Diego Zoo NFTs for sale, or a block to access the most popular recent content like "giraffes" or "lizards"
- For Marketplace:
  - If a load time for the marketplace is inevitable, then maybe we could add a loading animation instead of just the text.
  - Sections with varying content that is ForSale; need to design before coding.
- Refined styling:
  - NavBar updates
    - Center all text in the buffers properly
    - Make the logo clearly visible on top of the background; need to crop long logo img
    - A profile icon, settings icon
      - Flow wallet login under the profile icon's menu, see if can edit the default styling for the "Login/Sign Up" buttons and current logged in address displayed
  - Future possible pages:
    - Help page
    - Customize my collection page
    - Community page
      - Connection with the Twitter/Instagram/etc. API to show: 
        - Content associated with WildChain NFTs 
        - Chatter about WildChain
- A lower footer bar with:
  - Copyright
  - Sitemap (links to the HTML version of the website)
  - Privacy Policy
  Links to contact social media, privacy policy, terms of service, copyright, etc.
  - A sign up for users to be on the updates emailing list 
  - A bar where sponsors, shareholders, affiliated zoos etc. have their logos displayed
- Logo needs to be bigger, clearer
## Process Goals
- Improved scalablity, across laptop -> tablet -> phone
- Refined branding before more in-depth styling
- Sleek coloring and animated effects


# Setup Steps for Emulator Configuration

Use this setup if your ".env.local" config file has REACT_APP_ACCESS_NODE and REACT_APP_WALLET_DISCOVERY set up to local host endpoints, and REACT_APP_CONTRACT_PROFILE set up to the emulator provided address.

**While in project directory on terminals:**<br />
-In one terminal window, run dev-wallet with<br /> 
`yarn run dev-wallet`

-In second terminal window, start flow emulator:<br />
`flow emulator`

-In third terminal window, run:<br />
`yarn start`

# Running Flow Commands in Terminal:
-Deploy Contracts<br/>
`flow project deploy`<br/><br/>
-Mint NFTs (Right now mints one at a time, but we can work on mass minting later)<br/>
`flow transactions send ./src/cadence/transactions/mint_metadata.cdc` <br/><br/>
-Transfer NFTs to an account (Account must be added to emulator; Can be done by signing in, which I found we can use random emails/passwords for)<br/>
-Example Transfer Use:<br/>
`flow transactions send ./src/cadence/transactions/transfer_test.cdc --arg UInt64:1  --arg Address:0x01cf0e2f2f715450`<br/><br/>

-On site, initialize accounts through button on **Account Page** after logging in

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
