/**
 * Solana Blockchain Integration
 * Handles wallet connections, transactions, and AI twin commitment to blockchain
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from '@solana/web3.js';

// Get RPC endpoint from environment
const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

/**
 * Get Solana connection instance
 */
export function getConnection(): Connection {
  return new Connection(SOLANA_RPC, 'confirmed');
}

/**
 * Validate Solana wallet address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get wallet balance in SOL
 */
export async function getWalletBalance(address: string): Promise<number> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw new Error('Failed to get wallet balance');
  }
}

/**
 * Commitment metadata for AI digital twin
 */
export interface TwinCommitmentData {
  userId: string;
  email: string;
  personalityHash: string; // Hash of personality quiz answers
  diaryHash: string; // Hash of diary entries
  voiceHash?: string; // Optional hash of voice profile
  timestamp: number;
}

/**
 * Create memo instruction with AI twin metadata
 * This stores the commitment hash on-chain
 */
function createMemoInstruction(
  data: TwinCommitmentData,
  walletAddress: string
): TransactionInstruction {
  // Create a commitment hash of all the twin data
  const commitmentData = JSON.stringify({
    userId: data.userId,
    email: data.email,
    personalityHash: data.personalityHash,
    diaryHash: data.diaryHash,
    voiceHash: data.voiceHash || 'not-provided',
    timestamp: data.timestamp,
    version: '1.0',
  });

  // Memo program ID on Solana
  const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

  return new TransactionInstruction({
    keys: [{ pubkey: new PublicKey(walletAddress), isSigner: true, isWritable: false }],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(commitmentData, 'utf-8'),
  });
}

/**
 * Create a transaction to commit AI twin to blockchain
 * This creates a memo transaction with twin metadata
 */
export async function createCommitmentTransaction(
  walletAddress: string,
  twinData: TwinCommitmentData
): Promise<Transaction> {
  try {
    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);

    // Create transaction
    const transaction = new Transaction();

    // Add memo instruction with twin data
    const memoInstruction = createMemoInstruction(twinData, walletAddress);
    transaction.add(memoInstruction);

    // Optional: Add a small transfer to ensure transaction uniqueness (0.001 SOL to self)
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: publicKey,
      lamports: 1000, // 0.000001 SOL
    });
    transaction.add(transferInstruction);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    return transaction;
  } catch (error) {
    console.error('Error creating commitment transaction:', error);
    throw new Error('Failed to create commitment transaction');
  }
}

/**
 * Get transaction details from signature
 */
export async function getTransactionDetails(signature: string) {
  try {
    const connection = getConnection();
    const transaction = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });
    return transaction;
  } catch (error) {
    console.error('Error getting transaction details:', error);
    throw new Error('Failed to get transaction details');
  }
}

/**
 * Verify that a transaction exists on-chain
 */
export async function verifyTransaction(signature: string): Promise<boolean> {
  try {
    const transaction = await getTransactionDetails(signature);
    return transaction !== null;
  } catch {
    return false;
  }
}

/**
 * Get Solana Explorer URL for transaction
 */
export function getExplorerUrl(signature: string, cluster: 'devnet' | 'mainnet-beta' = 'devnet'): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
}

/**
 * Estimate transaction fee
 */
export async function estimateTransactionFee(transaction: Transaction): Promise<number> {
  try {
    const connection = getConnection();
    const fee = await connection.getFeeForMessage(transaction.compileMessage());
    return fee.value ? fee.value / LAMPORTS_PER_SOL : 0.000005; // Default estimate
  } catch (error) {
    console.error('Error estimating fee:', error);
    return 0.000005; // Default estimate
  }
}
