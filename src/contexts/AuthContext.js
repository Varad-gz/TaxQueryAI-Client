"use client";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

export function AuthProvider({ children }) {
    return (
        <SessionProvider
            refetchInterval={0}
            refetchOnWindowFocus={false}
            refetchWhenOffline={false}
        >
            {children}
        </SessionProvider>
    );
}

export function useAuth() {
    const { data: session, status, update } = useSession();

    const isAuthenticated = status === "authenticated" && !!session;
    const isLoading = status === "loading";

    return { session, status, isAuthenticated, isLoading, refreshSession: update };
}