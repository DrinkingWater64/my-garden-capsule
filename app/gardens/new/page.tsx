import { createGarden } from './actions'
import { SubmitButton } from './submit-button'
import Link from 'next/link'

export default async function NewGardenPage(props: {
    searchParams: Promise<{ error?: string }>
}) {
    const searchParams = await props.searchParams;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Plant a New Garden</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Create a space for your memories to grow.
                    </p>
                </div>

                <form action={createGarden} className="space-y-6">
                    {searchParams.error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md">
                            {searchParams.error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="title"
                            className="text-sm font-medium leading-none"
                        >
                            Garden Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g., Summer 2025"
                            required
                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-emerald-600 focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="reveal_date"
                            className="text-sm font-medium leading-none"
                        >
                            Reveal Date
                        </label>
                        <p className="text-xs text-zinc-500">When will this garden unlock?</p>
                        <input
                            id="reveal_date"
                            name="reveal_date"
                            type="date"
                            required
                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-emerald-600 focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 h-10 px-4 py-2 w-full dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 text-zinc-900 dark:text-zinc-100"
                        >
                            Cancel
                        </Link>
                        <SubmitButton className="w-full">
                            Create Garden
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    )
}
