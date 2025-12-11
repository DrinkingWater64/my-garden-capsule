import { PlantTreeForm } from './plant-form'

export default async function PlantTreePage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 5.3-2.1l.4.5.4-.5A3 3 0 0 1 10 10Z" /><path d="M7 16v6" /><path d="M13 19v3" /><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 1.3-1.1A7 7 0 1 0 8 15v4a1 1 0 0 0 1 1h3Z" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        Plant a tree<br />
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Leave a message for the future.
                    </p>
                </div>

                <PlantTreeForm gardenId={params.id} />
            </div>
        </div>
    )
}
