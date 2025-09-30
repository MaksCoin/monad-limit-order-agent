// main.js — pure browser, no build, no server
import { createPublicClient, http } from 'https://esm.sh/viem@2.19.0';
import { privateKeyToAccount } from 'https://esm.sh/viem@2.19.0/accounts';
import { toMetaMaskSmartAccount, Implementation } from 'https://esm.sh/@metamask/delegation-toolkit@0.1.0';

// === Monad Testnet ===
const monad = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz'] } },
};

const publicClient = createPublicClient({ chain: monad, transport: http() });

// === Canonical addresses (from Monad docs) ===
const USDC = '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea';
const WMON = '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701';
const ROUTER = '0xfb8e1c3b833f9e67a71c859a132cf783b645e436';

let smartAccount;

// === Step 1: Create Smart Account ===
document.getElementById('connect').onclick = async () => {
  try {
    // For demo only — in real app use secure key or wallet
    const demoKey = '0x' + '1'.repeat(64);
    const eoa = privateKeyToAccount(demoKey);

    smartAccount = await toMetaMaskSmartAccount({
      client: publicClient,
      implementation: Implementation.Hybrid,
      deployParams: [eoa.address, [], [], []],
      deploySalt: '0x',
      signer: { account: eoa }
    });

    document.getElementById('status').innerText = `✅ Smart Account: ${smartAccount.address}`;
    document.getElementById('delegate').disabled = false;
  } catch (err) {
    document.getElementById('status').innerText = `❌ ${err.message}`;
  }
};

// === Step 2: Grant Delegation to Uniswap Router ===
document.getElementById('delegate').onclick = async () => {
  if (!smartAccount) return;

  // Function selector for: swapExactTokensForTokens(uint256,uint256,address[],address,uint256)
  const delegation = {
    target: ROUTER,
    functionSelector: '0x38ed1739',
    expiration: BigInt(Math.floor(Date.now() / 1000) + 86400 * 30), // 30 days
     '0x'
  };

  // In real app: await smartAccount.signDelegation(delegation)
  console.log('✅ Delegation created:', delegation);
  document.getElementById('status').innerText += '\n✅ Delegation granted to Uniswap Router';
  document.getElementById('checkPrice').disabled = false;
};

// === Step 3: Check Price ===
document.getElementById('checkPrice').onclick = async () => {
  try {
    const target = parseFloat(document.getElementById('price').value);
    const amountIn = 1000000n; // 1 USDC (6 decimals)

    const amounts = await publicClient.readContract({
      address: ROUTER,
      abi: ['function getAmountsOut(uint256,address[]) view returns (uint256[])'],
      functionName: 'getAmountsOut',
      args: [amountIn, [USDC, WMON]]
    });

    const wmonOut = amounts[1]; // WMON amount (18 decimals)
    const usdcPerWmon = 1 / (Number(wmonOut) / 1e18); // USDC per 1 WMON

    document.getElementById('status').innerText += `\n📊 Current price: ${usdcPerWmon.toFixed(4)} USDC/WMON`;

    if (usdcPerWmon <= target) {
      document.getElementById('status').innerText += `\n🤖 Condition met! Agent can execute swap via delegation.`;
    }
  } catch (err) {
    document.getElementById('status').innerText += `\n❌ ${err.message}`;
  }
};
