import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnUser = nextUrl.pathname.startsWith('/user');

            if (isOnAdmin) {
                // strict check for ADMIN role
                if (isLoggedIn && (auth?.user as any).role === 'ADMIN') return true;
                return false; // Redirect unauthenticated or unauthorized
            }

            if (isOnUser) {
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
