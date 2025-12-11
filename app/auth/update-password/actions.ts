'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
        redirect('/auth/update-password?error=Passwords do not match')
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if (error) {
        redirect('/auth/update-password?error=Could not update password')
    }

    redirect('/dashboard')
}
