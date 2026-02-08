import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserByAuth0Id } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const auth0Id = session.user.sub;
    const user = await getUserByAuth0Id(auth0Id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete all diary entries for this user
    const { error: diaryError } = await supabaseAdmin
      .from('diary_entries')
      .delete()
      .eq('user_id', user.id);

    if (diaryError) {
      throw diaryError;
    }

    // Reset all user data columns except identity fields (id, auth0_id, email, name, picture, created_at)
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        assistant_id: null,
        thread_id: null,
        voice_id: null,
        voice_name: null,
        personality_completed: false,
        personality_type: null,
        personality_data: null,
        diary_entry_count: 0,
        voice_sample_uploaded: false,
        wallet_address: null,
        solana_tx_hash: null,
        blockchain_committed_at: null,
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'All user data cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing user data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear user data',
      },
      { status: 500 }
    );
  }
}
