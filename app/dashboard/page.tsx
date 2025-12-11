import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Dashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: gardens, error } = await supabase
        .from('gardens')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching gardens:", error)
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50">
            {/* Navigation Bar */}
            <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                        <span>My Garden</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="text-zinc-500 dark:text-zinc-400">
                            {user.email}
                        </div>
                        <form action="/auth/signout" method="post">
                            <button className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">My Garden</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Welcome back. Here is your personal digital sanctuary.</p>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add Garden Action */}
                    <Link href="/gardens/new" className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md col-span-1 md:col-span-3 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01] flex flex-col items-start justify-center min-h-[160px]">
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-semibold mb-2">Plant a New Garden</h3>
                            <p className="text-emerald-100 max-w-sm">Create a new collection for your memories to bloom when the time is right.</p>
                            <div className="mt-4 px-4 py-2 bg-white/20 inline-block rounded-lg text-sm font-medium border border-white/10">
                                Create Garden
                            </div>
                        </div>
                    </Link>

                    {/* Content List */}
                    <div className="col-span-1 md:col-span-3 mt-6">
                        <h2 className="text-lg font-semibold mb-4">Your Gardens</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(gardens || []).map((garden: any) => {
                                // Determine lock status based on date or explicit lock
                                const revealDate = new Date(garden.reveal_date)
                                // const isLocked = revealDate > new Date()
                                const isLocked = false // for dev purpose we are making it false
                                return (
                                    <Link
                                        href={`/gardens/${garden.id}`}
                                        key={garden.id}
                                        className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${isLocked
                                            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 hover:border-amber-400 dark:hover:border-amber-700'
                                            : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 hover:border-emerald-400 dark:hover:border-emerald-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${isLocked
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                }`}>
                                                {isLocked ? 'Locked' : 'Unlocked'}
                                            </span>
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {new Date(garden.reveal_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-lg mb-2 text-zinc-900 dark:text-zinc-100">
                                            {garden.title}
                                        </h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                            {isLocked
                                                ? "This garden is currently locked. Wait for the reveal date to explore its contents."
                                                : "This garden is open. Step inside to view your planted memories."}
                                        </p>
                                    </Link>
                                )
                            })}

                            {(!gardens || gardens.length === 0) && (
                                <div className="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400">
                                    You haven't planted any gardens yet. <br />
                                    Start by creating one above.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
