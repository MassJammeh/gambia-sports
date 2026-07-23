import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Verify the requesting user is super admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { email, role, communityId, displayName } = await request.json()

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
    }

    // Use service role to create user
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Invite user by email
    const { data: newUser, error: createError } = await adminSupabase.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gambia-sports-wine.vercel.app'}/auth/confirm`,
        data: {
          display_name: displayName || null,
        }
      }
    )

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    // Update their profile with role and community
    if (newUser.user) {
      await adminSupabase
        .from('profiles')
        .update({
          role,
          community_id: communityId || null,
          display_name: displayName || null,
          status: 'active',
        })
        .eq('id', newUser.user.id)
    }

    return NextResponse.json({ success: true, userId: newUser.user?.id })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}