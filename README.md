This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

Due to the current limitations of starkscan and voyager in verifying Cairo 1 contract source code, if you want to use it securely, please deploy the contract in the `contract` directory yourself and update the contract address variable in `src/services/utils.service.ts` after contract deployment.
