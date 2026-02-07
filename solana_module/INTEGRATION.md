# Solana Module Integration Guide

This guide explains how to integrate the Solana blockchain commitment feature into the Echo AI Digital Twin app.

## Installation

Dependencies are already installed. If needed:
```bash
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-react-ui @solana/wallet-adapter-base
```

## Setup

### 1. Wrap App with WalletProvider

Update `app/layout.tsx` to wrap the app with both UserProvider (Auth0) and WalletProvider (Solana):

```tsx
import { UserProvider } from '@auth0/nextjs-auth0/client';
import WalletProvider from '../solana_module/components/WalletProvider';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </UserProvider>
      </body>
    </html>
  );
}
```

### 2. Add Blockchain Commit Button to Home Page

Add a button to commit the AI twin to the blockchain in `app/home/page.tsx`:

```tsx
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import WalletConnect from '@/solana_module/components/WalletConnect';

// Inside your HomePage component:
const [committing, setCommitting] = useState(false);
const [txSignature, setTxSignature] = useState<string | null>(null);
const { publicKey, sendTransaction } = useWallet();
const { connection } = useConnection();

const handleCommitToBlockchain = async () => {
  if (!publicKey) {
    alert('Please connect your wallet first');
    return;
  }

  setCommitting(true);
  try {
    // Prepare twin data (you'll need to fetch this from your state/database)
    const twinData = {
      walletAddress: publicKey.toBase58(),
      personalityAnswers: {/* personality quiz data */},
      diaryEntries: {/* diary entries */},
      voiceData: {/* optional voice data */},
    };

    // Call API to create transaction
    const response = await fetch('/api/blockchain/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(twinData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    // Deserialize transaction
    const transaction = Transaction.from(
      Buffer.from(data.transaction, 'base64')
    );

    // Send transaction
    const signature = await sendTransaction(transaction, connection);

    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');

    setTxSignature(signature);
    alert('Successfully committed to blockchain!');
  } catch (error) {
    console.error('Error committing to blockchain:', error);
    alert('Failed to commit to blockchain');
  } finally {
    setCommitting(false);
  }
};
```

### 3. Add UI Elements

Add these components to your page:

```tsx
{/* Wallet Connection Section */}
<WalletConnect />

{/* Commit Button */}
<button
  onClick={handleCommitToBlockchain}
  disabled={!publicKey || committing}
  className="acrylic-button px-8 py-4 rounded-lg font-semibold text-gray-800"
>
  {committing ? 'Committing...' : 'Commit to Blockchain Forever'}
</button>

{/* Success Message */}
{txSignature && (
  <div className="success-message">
    <p>Transaction successful!</p>
    <a
      href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View on Solana Explorer
    </a>
  </div>
)}
```

## API Endpoints

### POST /api/blockchain/commit
Creates a blockchain commitment transaction.

**Request:**
```json
{
  "walletAddress": "wallet_public_key",
  "personalityAnswers": { /* quiz data */ },
  "diaryEntries": { /* diary data */ },
  "voiceData": { /* optional voice data */ }
}
```

**Response:**
```json
{
  "success": true,
  "transaction": "base64_encoded_transaction",
  "commitment": {
    "userId": "user_id",
    "email": "user@example.com",
    "personalityHash": "sha256_hash",
    "diaryHash": "sha256_hash",
    "voiceHash": "sha256_hash",
    "timestamp": 1234567890
  },
  "message": "Transaction created. Please sign with your wallet."
}
```

### GET /api/blockchain/commit?signature=xxx
Verifies and returns commitment details.

**Response:**
```json
{
  "success": true,
  "signature": "transaction_signature",
  "explorerUrl": "https://explorer.solana.com/tx/...",
  "message": "View your commitment on Solana Explorer"
}
```

## Database Integration (Optional)

To store wallet addresses and transaction signatures in Supabase, add these fields to your users table:

```sql
ALTER TABLE users ADD COLUMN wallet_address TEXT;
ALTER TABLE users ADD COLUMN solana_tx_hash TEXT;
ALTER TABLE users ADD COLUMN blockchain_committed_at TIMESTAMP;
```

Then update the user record after successful commitment:

```tsx
// After transaction confirmation
await fetch('/api/user/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wallet_address: publicKey.toBase58(),
    solana_tx_hash: signature,
    blockchain_committed_at: new Date().toISOString(),
  }),
});
```

## Testing

1. **Get Devnet SOL**: Use [Solana Faucet](https://faucet.solana.com/) to get test SOL
2. **Install Phantom Wallet**: Get it from [phantom.app](https://phantom.app)
3. **Switch to Devnet**: In Phantom settings, switch network to "Devnet"
4. **Connect Wallet**: Click "Connect Wallet" button in your app
5. **Commit Twin**: Click "Commit to Blockchain Forever" and approve transaction
6. **View on Explorer**: Check the transaction on Solana Explorer

## Security Notes

- Transactions are signed client-side with user's wallet
- API never has access to private keys
- Commitment data is hashed (SHA-256) before storage on-chain
- Works on Devnet for testing, ready for Mainnet deployment
- Requires ~0.000005 SOL for transaction fees

## Production Deployment

To deploy to Mainnet:

1. Update `NEXT_PUBLIC_SOLANA_RPC` to mainnet endpoint
2. Change `getExplorerUrl` cluster parameter to `'mainnet-beta'`
3. Test thoroughly on Devnet first
4. Ensure users have enough SOL for transaction fees
