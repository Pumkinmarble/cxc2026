/**
 * Blockchain Commitment Confirmation API Route
 * Persists the confirmed transaction signature for the user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../lib/auth';
import { updateBlockchainCommitment } from '../../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { walletAddress, signature } = body;

    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!signature || typeof signature !== 'string') {
      return NextResponse.json(
        { error: 'Invalid transaction signature' },
        { status: 400 }
      );
    }

    await updateBlockchainCommitment(session.user.sub, walletAddress, signature);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error confirming blockchain commitment:', error);

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to confirm blockchain commitment' },
      { status: 500 }
    );
  }
}
