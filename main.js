// main.js — ФИНАЛЬНАЯ РАБОЧАЯ ВЕРСИЯ С НАДЕЖНЫМИ ССЫЛКАМИ
// ИЗМЕНЕНО: Ссылки заменены на стабильный CDN unpkg.com
import { createPublicClient, http } from 'https://unpkg.com/viem@2.10.0/dist/esm/index.js';
import { privateKeyToAccount } from 'https://unpkg.com/viem@2.10.0/dist/esm/accounts/index.js';
import { toMetaMaskSmartAccount, Implementation } from 'https://unpkg.com/@metamask/delegation-toolkit@0.1.0/dist/esm/index.js';

// === Monad Testnet ===
const monad = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://corsproxy.io/?https://testnet-rpc.monad.xyz']
    }
  },
};

const publicClient = createPublicClient({ chain: monad, transport: http() });

// === Token & Contract addresses ===
const USDC = '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea';
const WMON = '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701';
const ROUTER = '0xfB8e1C3b833f9E67a71C859a132cf783b645e436';
const YOUR_CONTRACT = '0x558EcC6DDd722CE23448e5c411628dB67eD4B23c';

let smartAccount;
let signedDelegation;

// === Step 1: Create Smart Account ===
document.getElementById('connect').onclick = async () => {
  try {
    document.getElementById('status').innerText = '⏳ Creating Smart Account...';
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
    console.error('Smart Account error:', err);
    document.getElementById('status').innerText = `❌ ${err.message || 'Check console'}`;
  }
};

// === Step 2: Grant Delegation to YOUR contract ===
document.getElementById('delegate').onclick = async () => {
  if (!smartAccount) return;
  document.getElementById('status').innerText += `\n⏳ Waiting for delegation signature...`;

  try {
    const delegation = {
      target: YOUR_CONTRACT,
      functionSelector: '0xb31e6e09', // keccak256("executeOrder(address)")
      expiration: BigInt(Math.floor(Date.now() / 1000) + 86400 * 30), // 30 days
      salt: '0x'
    };
    
    signedDelegation = await smartAccount.signDelegation(delegation);
    
    console.log('✅ Delegation signed:', signedDelegation);
    
    document.getElementById('status').innerText += `\n✅ Delegation signed and granted to:\n${YOUR_CONTRACT}`;
    document.getElementById('checkPrice').disabled = false;

  } catch (err) {
    console.error('Delegation error:', err);
    document.getElementById('status').innerText += `\n❌ Delegation error: ${err.message || 'Check console'}`;
  }
};

// === Step 3: Check Current Price ===
document.getElementById('checkPrice').onclick = async () => {
  try {
    const target = parseFloat(document.getElementById('price').value);
    const amountIn = 1000000n; // 1 USDC

    document.getElementById('status').innerText += `\n⏳ Checking price...`;

    const amounts = await publicClient.readContract({
      address: ROUTER,
      abi: ['function getAmountsOut(uint256,address[]) view returns (uint256[])'],
      functionName: 'getAmountsOut',
      args: [amountIn, [USDC, WMON]]
    });

    const wmonOut = amounts[1];
    const usdcPerWmon = 1 / (Number(wmonOut) / 1e18);

    document.getElementById('status').innerText += `\n📊 Current price: ${usdcPerWmon.toFixed(4)} USDC/WMON`;

    if (usdcPerWmon <= target) {
      document.getElementById('status').innerText += `\n🤖 Condition met! Agent can now call executeOrder(user) with the signed delegation.`;
    } else {
      document.getElementById('status').innerText += `\n📉 Condition not met. Current price is higher than target.`;
    }
  } catch (err) {
    console.error('Price check error:', err);
    document.getElementById('status').innerText += `\n❌ ${err.message || 'Check console'}`;
  }
};
