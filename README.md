# Monad Limit Order via Delegation

> Submission for **MetaMask Smart Accounts x Monad Dev Cook-Off**  
> Track: **Best on-chain automation**

Automatically execute token swaps on **Monad Testnet** when a price target is reached — using only **MetaMask Smart Accounts** and **delegations** to the canonical UniswapV2Router.

-Uses MetaMask Delegation Toolkit  
-Runs on Monad Testnet (Chain ID 10143)  
-Fully browser-based (GitHub Pages)  
-No backend, no custom contracts


## Live Demo

https://MaksCoin.github.io/monad-limit-order


##  How It Works

1. User creates a **MetaMask Smart Account** on Monad Testnet
2. Grants **delegation** to call `swapExactTokensForTokens` on the official **UniswapV2Router**
3. App checks current **USDC/WMON price** via `getAmountsOut`
4. If price ≤ target → an agent (e.g., relayer or frontend) can execute the swap **on user's behalf**

All logic uses **canonical contracts** from Monad Testnet:
- UniswapV2Router: `0xfb8e1c3b833f9e67a71c859a132cf783b645e436`
- USDC: `0xf817257fed379853cDe0fa4F97AB987181B1E5Ea`
- WMON: `0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701`

