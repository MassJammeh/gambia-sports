'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePathname } from 'next/navigation'

const TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export default function InactivityLogout() {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  function resetTimer() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/admin/login'
    }, TIMEOUT_MS)
  }

  // Handle visibility change - sign out when tab becomes hidden
  useEffect(() => {
    async function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        // Start a short timer — if they come back within 30 seconds keep session
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(async () => {
          const supabase = createClient()
          await supabase.auth.signOut()
        }, 30 * 1000) // 30 seconds away = sign out
      } else {
        // They came back — check if still authenticated
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          window.location.href = '/admin/login'
        } else {
          // Reset inactivity timer
          resetTimer()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Inactivity timer
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return null
}