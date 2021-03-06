# Lunch-n-Learn Smart Contract Monorepo Example

Howdy, the purpose of this example repo is to show you how you can connect a simple "greeter" smart contract with a frontend and achieve full type-safety while interfacing with your contract.

**DISCLAIMER** Much of this was adapted from the work of Nader Dabit, whose guide I found to be very helpful: https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13

## Installation

1. Clone this repo
2. Run `yarn install` to install all dependencies
3. `cd` into `smart-contract` and run `yarn compile`. This will compile the ABI of the smart contract.
4. `cd` into `webapp` and run `yarn compile-greeter-contract` to generate typings for you to use on the frontend
5. Start up a local blockchain: `yarn hardhat node` from the `smart-contract` directory
6. Deploy the greeter contract to the local chain: `yarn deploy-local` from the `smart-contract directory`
7. And finally, you can now run the frontend: `yarn dev` from the `webapp` directory

## Gotchas and protips

Remember you need this piece of config to make MetaMask play nice with your local chain when you run Hardhat:

```
  networks: {
    hardhat: {
      chainId: 1337, // this right here
    },
  },
```

Speaking of MetaMask, if you get cryptic unexplainable errors while trying to get your frontend to connect to the local chain, it's possibly because you need to reset your MetaMask wallet. Go to My Accounts -> Settings -> Advanced and click Reset Account. This should fix it up.

This block for hoisting is important, Hardhat doesn't play nice in monorepos right now:

```
  "workspaces": {
    "packages": [
      "webapp",
      "smart-contract"
    ],
    "nohoist": [
      "**/hardhat",
      "**/hardhat/**",
      "**/solidity-coverage",
      "**/solidity-coverage/**"
    ]
  },
```
