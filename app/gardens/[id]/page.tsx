import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { DeleteGardenButton } from './delete-button'
import { CopyLinkButton } from './copy-link'

export default async function GardenDetailsPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params;
    const supabase = await createClient()

    const { data: garden } = await supabase
        .from('gardens')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!garden) {
        notFound()
    }

    const revealDate = new Date(garden.reveal_date)
    const isLocked = garden.is_locked && revealDate > new Date()

    const { data: trees } = await supabase
        .from('trees')
        .select('*')
        .eq('garden_id', params.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50">
            {/* Header / Nav Area */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-3">
                        <CopyLinkButton gardenId={garden.id} />
                        <DeleteGardenButton id={garden.id} />
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${isLocked
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                }`}>
                                {isLocked ? 'Locked' : 'Unlocked'}
                            </span>
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                Reveals on {revealDate.toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {garden.title}
                        </h1>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {isLocked ? (
                        <div className="w-full h-96 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center p-12 text-center">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>
                                <h3 className="text-lg font-medium">This garden is locked</h3>
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    You'll be able to see the memories planted here on {revealDate.toLocaleDateString()}.
                                    Patiently wait for the bloom.
                                </p>
                            </div>
                        </div>
                    ) : (
                        trees && trees.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {trees.map((tree) => (
                                    <div key={tree.id} className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                        <div className="mb-4 text-emerald-600 dark:text-emerald-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C8 2 6 8 6 12C6 16 9 22 12 22C15 22 18 16 18 12C18 8 16 2 12 2Z" /></svg>
                                            {/* Placeholder Tree Icon */}
                                        </div>
                                        <p className="text-zinc-900 dark:text-zinc-100 mb-4 whitespace-pre-wrap font-medium">
                                            "{tree.message_content}"
                                        </p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            - {tree.guest_name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full h-96 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center p-12 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                                    </div>
                                    <h3 className="text-lg font-medium">The garden is open</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400">
                                        No trees have been planted yet. Share the link to invite others!
                                    </p>
                                    <CopyLinkButton gardenId={garden.id} />
                                </div>
                            </div>
                        )
                    )}
                </div>

            </main>
        </div>
    )
}
