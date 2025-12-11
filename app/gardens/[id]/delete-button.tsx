'use client'

import { deleteGarden } from './actions'
import { useState, useTransition } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'

export function DeleteGardenButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = () => {
        startTransition(async () => {
            await deleteGarden(id)
        })
    }

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">
                    Are you sure?
                </span>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isPending}
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 px-3 py-1 rounded-md transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Confirm Delete
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 text-red-600/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-2 rounded-md transition-colors text-sm"
        >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Delete Garden</span>
        </button>
    )
}
