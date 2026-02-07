import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { personalityType, dimensions, description, sessionId } = await request.json();

    // For now, create/use a demo user (later we'll integrate Auth0)
    const demoEmail = `demo-${sessionId}@echo.ai`;
    const demoAuth0Id = `demo_${sessionId}`;

    // Check if user exists
    let { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth0_id', demoAuth0Id)
      .single();

    let userId: string;

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create one
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert([
          {
            auth0_id: demoAuth0Id,
            email: demoEmail,
            name: 'Demo User',
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      userId = newUser.id;
    } else if (fetchError) {
      throw fetchError;
    } else {
      userId = existingUser.id;
    }

    // Update user with personality data
    const personalityData = {
      type: personalityType,
      dimensions,
      description,
      completedAt: new Date().toISOString(),
    };

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        personality_completed: true,
        personality_type: personalityType,
        personality_data: personalityData,
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      userId,
      message: 'Personality results saved successfully!',
    });
  } catch (error) {
    console.error('Error saving personality results:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save personality results',
      },
      { status: 500 }
    );
  }
}
