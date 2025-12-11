
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
    const supabase = await createClient();

    // Check if we have a session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        await supabase.auth.signOut();
    }

    // Reload the page logic handled by valid caching, 
    // but for signout we typically redirect to the home or login page
    redirect("/login");
}
