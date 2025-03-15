import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const protectedRoutes = ["/interact", "/profile", '/visualize', '/dashboard', '/logout', '/datasets'];

    if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    const authPages = ["/signin", "/signup", "/"];

    if (token && authPages.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/interact", req.url));
    }

    return NextResponse.next();
}

export const config = {};
