'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { plantTree } from './actions'
import { Check } from 'lucide-react'

export function PlantTreeForm({ gardenId }: { gardenId: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setError(null)

        const result = await plantTree(gardenId, formData)

        if (result?.error) {
            setError(result.error)
            setIsSubmitting(false)
        } else {
            setSuccess(true)
            // Redirect after a short delay to let them see the success message
            setTimeout(() => {
                router.push('/')
            }, 2000)
        }
    }

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                    <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Tree Planted!</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                    Your message has been safely stored in the garden.
                    <br />
                    Redirecting you home...
                </p>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md text-sm border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Your Name
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-zinc-400"
                    placeholder="Enter your name"
                />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Message
                </label>
                <textarea
                    name="message"
                    id="message"
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-zinc-400"
                    placeholder="Write a message for the future..."
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-sm"
            >
                {isSubmitting ? 'Planting...' : 'Plant Tree'}
            </button>
        </form>
    )
}
