'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function forgotPassword(formData: FormData) {
    const email = formData.get('email') as string
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/confirm?next=/auth/update-password`,
    })

    if (error) {
        console.error('Reset password error:', error)
        redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`)
    }

    redirect('/forgot-password?message=Check your email for the reset link')
}
