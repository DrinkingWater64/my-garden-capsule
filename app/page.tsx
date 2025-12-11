import Image from "next/image";
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  return (
    <main>
      <h1>My Garden</h1>
    </main>
  );
}
