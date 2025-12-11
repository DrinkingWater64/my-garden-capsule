import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { login, signup } from './actions'
import { SubmitButtons } from './submit-buttons'

export default async function LoginPage(props: {
    searchParams: Promise<{ error?: string, message?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    const searchParams = await props.searchParams;

    return (
        <div className="min-h-screen grid lg:grid-cols-2 font-sans">
            {/* Visual Side */}
            <div className="hidden lg:relative lg:block bg-zinc-900 border-r border-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-zinc-900 to-zinc-900" />
                <div className="relative z-10 flex flex-col h-full p-10 text-white justify-between">
                    <div className="flex items-center gap-2 font-medium text-lg text-emerald-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                        My Garden Capsule
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                            Cultivate your thoughts<br />
                            Watch them grow.
                        </h1>
                        <p className="text-lg text-zinc-400 max-w-md">
                            A digital sanctuary for your ideas, memories, and daily reflections. Login to tend to your garden.
                        </p>
                    </div>
                    <div className="text-zinc-600 text-sm">
                        © 2025 My Garden Capsule. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center min-h-screen p-6 lg:p-8 bg-zinc-50 dark:bg-black">
                <div className="mx-auto w-full max-w-[380px] space-y-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                            Welcome back
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form className="space-y-5">
                        {searchParams.message && (
                            <div className="p-3 text-sm text-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900 rounded-md">
                                {searchParams.message}
                            </div>
                        )}
                        {searchParams.error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md">
                                {searchParams.error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-emerald-600 focus:border-emerald-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                        </div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100"
                            >
                                Password
                            </label>
                            <a
                                href="/forgot-password"
                                className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-emerald-600 focus:border-emerald-500 transition-colors"
                        />
                        <SubmitButtons loginAction={login} signupAction={signup} />
                    </form>
                </div>
            </div>
        </div>
    )
}
