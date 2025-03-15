import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const STORAGE_BUCKET = "profile-pictures";

const getFileExtension = (mimeType) => {
    const mimeToExt = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
    };
    return mimeToExt[mimeType] || "jpg";
};

export const authConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async profile(profile) {

                const { data: existingUser } = await supabase
                    .from("profiles")
                    .select("id, image")
                    .eq("email", profile.email)
                    .single();

                if (!existingUser) {

                    let imageUrl = null;

                    try {
                        const response = await fetch(profile.picture);
                        const blob = await response.blob();
                        const fileExt = getFileExtension(blob.type);
                        const fileName = `google-${profile.sub}.${fileExt}`;

                        const { data: uploadData, error: uploadError } = await supabase.storage
                            .from(STORAGE_BUCKET)
                            .upload(fileName, blob);

                        if (!uploadError) {
                            const { data: publicUrlData } = supabase.storage
                                .from(STORAGE_BUCKET)
                                .getPublicUrl(fileName);

                            imageUrl = publicUrlData.publicUrl;
                        }
                    } catch (error) {
                        console.error("Error uploading Google profile picture:", error);
                    }

                    const { data: newUser } = await supabase
                        .from("profiles")
                        .insert([
                            {
                                name: profile.name,
                                email: profile.email,
                                password: null,
                                image: imageUrl,
                                method: "google",
                                created_at: new Date(),
                            },
                        ])
                        .single();

                    return {
                        id: newUser.id,
                        name: profile.name,
                        email: profile.email,
                        image: imageUrl,
                        method: "google",
                    };
                }

                return {
                    id: existingUser.id,
                    name: profile.name,
                    email: profile.email,
                    image: existingUser.image,
                    method: "google",
                };
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email:", type: "email" },
                password: { label: "Password:", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials;

                const { data: user, error } = await supabase
                    .from("profiles")
                    .select("id, name, email, password, method, image")
                    .eq("email", email)
                    .single();

                if (error || !user) throw new Error("Invalid email");

                if (user.method === "google") {
                    throw new Error("This email is associated with Google Sign-In");
                }

                if (!user.password || !(await bcrypt.compare(password, user.password))) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: null,
                    method: "local",
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.method = user.method;
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.method = token.method;
                session.user.image = token.image;
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
        updateAge: 12 * 60 * 60,
    },
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };