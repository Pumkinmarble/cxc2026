'use client';

/**
 * Blockchain Commitment Component
 * Handles the commitment of AI twin data to Solana blockchain
 */

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';

interface CommitData {
  personalityAnswers?: any;
  diaryEntries?: any;
  voiceData?: any;
}

interface Props {
  twinData: CommitData;
  onSuccess?: (signature: string) => void;
  onError?: (error: Error) => void;
}

export default function BlockchainCommit({ twinData, onSuccess, onError }: Props) {
  const [committing, setCommitting] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const handleCommit = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!twinData.personalityAnswers || !twinData.diaryEntries) {
      alert('Please complete personality quiz and diary entries first');
      return;
    }

    setCommitting(true);
    try {
      // Prepare commitment data
      const commitData = {
        walletAddress: publicKey.toBase58(),
        personalityAnswers: twinData.personalityAnswers,
        diaryEntries: twinData.diaryEntries,
        voiceData: twinData.voiceData,
      };

      // Call API to create transaction
      const response = await fetch('/api/blockchain/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commitData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create transaction');
      }

      // Deserialize and send transaction
      const transaction = Transaction.from(Buffer.from(data.transaction, 'base64'));
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      setTxSignature(signature);
      onSuccess?.(signature);
    } catch (error) {
      console.error('Error committing to blockchain:', error);
      onError?.(error as Error);
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Commit Button */}
      <button
        onClick={handleCommit}
        disabled={!publicKey || committing}
        className={`w-full py-4 rounded-lg font-semibold transition ${
          !publicKey || committing
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
        }`}
      >
        {committing ? 'Committing to Blockchain...' : 'Lock Your Twin Forever on Blockchain'}
      </button>

      {/* Success Message */}
      {txSignature && (
        <div
          className="rounded-xl p-4 border border-green-200"
          style={{
            background: 'linear-gradient(145deg, #F0FFF4, #E6FFED)',
          }}
        >
          <p className="text-sm font-semibold text-green-800 mb-2">
            ✅ Successfully committed to blockchain!
          </p>
          <p className="text-xs text-green-700 mb-2 font-mono break-all">
            Transaction: {txSignature}
          </p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View on Solana Explorer →
          </a>
        </div>
      )}

      {/* Info */}
      {!publicKey && (
        <p className="text-xs text-gray-600 text-center">
          Connect your wallet above to commit your AI twin to the blockchain
        </p>
      )}

      {publicKey && !txSignature && (
        <p className="text-xs text-gray-600 text-center">
          This will create a permanent record of your digital twin on the Solana blockchain
        </p>
      )}
    </div>
  );
}
