'use client'

import { useFormStatus } from 'react-dom'
import { type ComponentProps } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonProps = ComponentProps<'button'>

export function SubmitButton({ children, className, ...props }: ButtonProps) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700/90 h-10 px-4 py-2 w-full dark:bg-emerald-600 dark:text-zinc-50 dark:hover:bg-emerald-600/90 ${className}`}
            {...props}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Planting...
                </>
            ) : (
                children
            )}
        </button>
    )
}
