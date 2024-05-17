This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The contract is for dispersing erc20 token in Starknet to multiple addresses.
## Getting Started

First, run the development server:

```bash
npm install
# then
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

Please test it with testnet.

Due to the current limitations of starkscan and voyager in verifying Cairo 1 contract source code, if you want to use it securely, please deploy the contract in the `contract` directory yourself and update the contract address variable in `src/services/utils.service.ts` after contract deployment.

Here are the disperse contract in this repo:

Testnet: 0x01cddfc8b081342199e75413caccff64f2ff7f15954267ad95152fdacf66d25b

Mainnet: 0x00ecbd1107cdd47d0762908f6933b75d5b96896893dbf20c399c3808410ce940

author address: 0x0785169216de6d9E8035D721E42fcebd4d441bdc5BF51216a75D807899E8B803
