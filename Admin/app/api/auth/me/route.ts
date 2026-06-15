import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // First try to get the token from the Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    let user;
    let error;

    if (token) {
      const response = await supabase.auth.getUser(token);
      user = response.data.user;
      error = response.error;
    } else {
      // Fallback to session/cookie-based auth
      const response = await supabase.auth.getUser();
      user = response.data.user;
      error = response.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
