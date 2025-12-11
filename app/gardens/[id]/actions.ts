'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deleteGarden(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('gardens')
        .delete()
        .eq('id', id)

    if (error) {
        redirect(`/gardens/${id}?error=Could not delete garden`)
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
