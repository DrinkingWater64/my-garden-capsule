import Image from "next/image";
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <h1 className="text-4xl font-bold mb-4">My Garden</h1>
      <p className="mb-8 text-zinc-500">Cultivate your digital memories.</p>
      <a
        href="/login"
        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
      >
        Enter Garden
      </a>
    </main>
  );
}
