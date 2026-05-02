import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/projects") || 
                           nextUrl.pathname.startsWith("/upload") || 
                           nextUrl.pathname.startsWith("/analysis");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to signin
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
