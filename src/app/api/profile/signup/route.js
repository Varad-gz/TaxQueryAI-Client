import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
        return NextResponse.json(
            { message: "Email and password are required" },
            { status: 400 }
        );
    }

    try {
        const { data: existingUser, error: existingUserError } = await supabase
            .from("profiles")
            .select("email")
            .eq("email", email)
            .maybeSingle();

        if (existingUserError) {
            throw existingUserError;
        }

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: newUser, error: insertError } = await supabase
            .from("profiles")
            .insert([
                {
                    email,
                    password: hashedPassword,
                    name: fullName,
                    method: "local",
                    created_at: new Date(),
                },
            ])
            .single();

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json(
            { message: "User signed up successfully", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}