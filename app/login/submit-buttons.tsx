'use client'

import { useFormStatus } from 'react-dom'
import { type ComponentProps } from 'react'
import { Loader2 } from 'lucide-react'

type SubmitButtonsProps = {
    loginAction: (formData: FormData) => Promise<void>
    signupAction: (formData: FormData) => Promise<void>
}

export function SubmitButtons({ loginAction, signupAction }: SubmitButtonsProps) {
    const { pending, data } = useFormStatus()

    // We can't easily know EXACTLY which button was clicked without a bit of a hack 
    // or checking the data if we added a hidden input, but useFormStatus data 
    // is only available during the submission.
    // A simpler UX pattern for this dual-button form:
    // Just show spinner on the generic "pending" state for the whole form, 
    // but we can try to be specific if we used onClick handlers, but server actions 
    // work best with standard forms.
    // valid pattern: add name="action" value="login" to buttons and check data.get('action')

    const action = data?.get('action')
    const isLogin = action === 'login'
    const isSignup = action === 'signup'

    // Refined Logic: If pending is true but we don't know the action (initial hydration or edge case),
    // default to just disabling all.

    return (
        <div className="flex flex-col gap-3 pt-2">
            <button
                formAction={loginAction}
                name="action"
                value="login"
                disabled={pending}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700/90 h-10 px-4 py-2 w-full dark:bg-emerald-600 dark:text-zinc-50 dark:hover:bg-emerald-600/90"
            >
                {pending && isLogin ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign In
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-50 px-2 text-muted-foreground dark:bg-black text-zinc-500">
                        Or continue with
                    </span>
                </div>
            </div>

            <button
                formAction={signupAction}
                name="action"
                value="signup"
                disabled={pending}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 h-10 px-4 py-2 w-full dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 text-zinc-900 dark:text-zinc-100"
            >
                {pending && isSignup ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign Up
            </button>
        </div>
    )
}
