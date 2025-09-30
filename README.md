# monad-limit-order-agent

> Submission for **MetaMask Smart Accounts x Monad Dev Cook-Off**  
> Track: **Best on-chain automation**  
> Bonus: **Envio Integration** ($1,000+)

Automatically executes token swaps on **Monad Testnet** when a target price is reached — using **MetaMask Smart Accounts** and **delegations**.

-Uses MetaMask Delegation Toolkit  
-Runs on Monad Testnet (Chain ID 10143)  
-Powered by Envio HyperSync for real-time price monitoring  
-Fully browser-based frontend (HTML/JS)

---

## Demo Flow

1. User connects & creates a MetaMask Smart Account
2. Sets a limit order (e.g., "Buy WMON when price ≤ 1.5 USDC")
3. Grants **delegation** to allow a bot to execute on their behalf
4. Envio monitors Uniswap V2 `Swap` events via HyperSync
5. When price condition is met → bot sends UserOp to execute swap

---

## Tech Stack

- **Frontend**: HTML + Viem + Delegation Toolkit (ESM)
- **Smart Contract**: Solidity (no logic needed — delegation allows direct router call)
- **Indexing**: Envio HyperSync
- **Network**: Monad Testnet
- **Tokens**: USDC → WMON (via Uniswap V2)

---

## Setup

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
