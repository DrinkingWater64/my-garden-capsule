import { forgotPassword } from './actions'
import { SubmitButton } from './submit-buttons'
import Link from 'next/link'

export default async function ForgotPasswordPage(props: {
    searchParams: Promise<{ error?: string; message?: string }>
}) {
    const searchParams = await props.searchParams;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form className="space-y-4">
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
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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

                    <SubmitButton formAction={forgotPassword}>
                        Send Reset Link
                    </SubmitButton>

                    <Link
                        href="/login"
                        className="block text-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 underline underline-offset-4"
                    >
                        Back to Login
                    </Link>
                </form>
            </div>
        </div>
    )
}
