'use client'

import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
    const { session, isLoading } = useAuth();

    if (isLoading) return <p>Loading...</p>;
    if (!session) return <p>Not logged in</p>;

    return <p>Welcome, {session.user.name}!</p>;
}
