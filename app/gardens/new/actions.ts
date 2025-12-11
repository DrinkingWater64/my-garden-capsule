'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createGarden(formData: FormData) {
    const title = formData.get('title') as string
    const revealDate = formData.get('reveal_date') as string

    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { error } = await supabase.from('gardens').insert({
        title,
        reveal_date: revealDate,
        owner_id: user.id,
    })

    if (error) {
        redirect('/gardens/new?error=Could not create garden')
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
