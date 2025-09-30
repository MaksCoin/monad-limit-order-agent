# Monad Limit Order Agent

Automatically executes token swaps on **Monad Testnet** when a target price is reached — using **MetaMask Smart Accounts** and **delegations** to a custom limit order contract.

-Uses MetaMask Delegation Toolkit  
-Runs on Monad Testnet (Chain ID 10143)  
-Contract: `0x558EcC6DDd722CE23448e5c411628dB67eD4B23c`  
-Fully browser-based (GitHub Pages)


## 🔗 Live Demo

https://makscoin.github.io/monad-limit-order-agent/

## 🚀 How It Works

1. User creates a **MetaMask Smart Account** on Monad Testnet
2. Grants **delegation** to call `executeOrder(address)` on the limit order contract
3. App checks current **USDC/WMON price**
4. If price ≤ target → agent can execute swap **on user's behalf**

## Contract Addresses

- **Limit Order Agent**: [`0x558EcC6DDd722CE23448e5c411628dB67eD4B23c`](https://testnet.monadexplorer.com/address/0x558EcC6DDd722CE23448e5c411628dB67eD4B23c)
- **UniswapV2Router**: `0xfB8e1C3b833f9E67a71C859a132cf783b645e436`
- **USDC**: `0xf817257fed379853cDe0fa4F97AB987181B1E5Ea`
- **WMON**: `0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701`
