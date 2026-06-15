import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body = await request.json();
    const { email, password } = body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    if (data.user) {
      // Mirror user in your own DB via Supabase
      const { error: dbError } = await supabase.from("users").insert({
        id: data.user.id,
        email: email,
        createdAt: new Date().toISOString(),
      });

      if (dbError) {
        console.error("Error mirroring user to users table:", dbError);
        // We do not fail the request if user mirroring fails, but you might want to.
      }
    }

    return NextResponse.json({ user: data.user, session: data.session }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
