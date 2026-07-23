import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

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

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user already exists
    const { data: existingUsers } = await adminSupabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find((u: any) => u.email === email)

    if (existingUser) {
      // Update their profile
      await adminSupabase
        .from('profiles')
        .update({
          role,
          community_id: communityId || null,
          display_name: displayName || null,
          status: 'active',
        })
        .eq('id', existingUser.id)

      // Send magic link so they can login again
      const { error: linkError } = await adminSupabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gambia-sports-wine.vercel.app'}/auth/set-password`,
        }
      })

      if (linkError) {
        return NextResponse.json({
          success: true,
          message: 'User profile updated. They can login with their existing password.',
        })
      }

      return NextResponse.json({
        success: true,
        message: 'User updated and a new login link has been sent to their email.',
      })
    }

    // New user — send invite
    const { data: newUser, error: createError } = await adminSupabase.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gambia-sports-wine.vercel.app'}/auth/confirm`,
        data: { display_name: displayName || null }
      }
    )

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

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
    console.error('Create user error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}