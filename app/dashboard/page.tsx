import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
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
                    {/* Stats Card */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5" /><path d="M9 12a5 5 0 1 1 10 0" /><path d="M11 7h2" /><path d="M3 13a7 7 0 0 0 -3 7" /><path d="M12 22a7 7 0 0 0 7 -7" /></svg>
                            </div>
                            <h3 className="font-semibold">Planted Capsules</h3>
                        </div>
                        <div className="text-3xl font-bold">12</div>
                        <div className="text-sm text-zinc-500 mt-1">+2 this week</div>
                    </div>

                    {/* Quick Action Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md col-span-1 md:col-span-2 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01]">
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                        <div className="relative z-10 flex flex-col items-start justify-between h-full">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Plant a New Memory</h3>
                                <p className="text-emerald-100 max-w-sm">Capture a thought, a moment, or an idea to nurture in your garden.</p>
                            </div>
                            <button className="mt-6 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-sm font-medium transition-colors border border-white/10">
                                Create Capsule
                            </button>
                        </div>
                    </div>

                    {/* Content List */}
                    <div className="col-span-1 md:col-span-3 mt-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Growth</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Placeholder Items */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="group relative p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:border-emerald-500/50 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">Journal</span>
                                        <span className="text-xs text-zinc-400">2 days ago</span>
                                    </div>
                                    <h3 className="font-medium text-lg mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Morning Reflection</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                        The sun was hitting the leaves just right today. It reminded me that growth takes time and patience...
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
