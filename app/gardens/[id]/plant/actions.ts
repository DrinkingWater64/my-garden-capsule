'use server'

import { createClient } from '@/utils/supabase/server'

export async function plantTree(gardenId: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const message = formData.get('message') as string

    if (!name || !message) {
        return { error: 'Name and message are required' }
    }

    // Dummy config for now
    const treeConfig = {
        type: 'oak',
        color: '#2d6a4f',
        scale: 1.0
    }

    const { error } = await supabase.from('trees').insert({
        garden_id: gardenId,
        guest_name: name,
        message_content: message,
        tree_config: treeConfig // passing object directly, Supabase client handles JSON
    })

    if (error) {
        console.error('Error planting tree:', error)
        return { error: 'Failed to plant tree. Please try again.' }
    }

    return { success: true }
}
