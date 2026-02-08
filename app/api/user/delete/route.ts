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

    // Delete the user row itself
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete account',
      },
      { status: 500 }
    );
  }
}
