import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import fetchApi from "./fetchApi";


export const AuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "text", },
        password: {  label: "Password", type: "password" }
      },
      
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        const user = await fetchApi("/auth/login", "POST", { email, password });

        if (user?.status_code !== 200) {
          throw new Error(user?.message ?? "Login failed");
        }

        return {
          id: user.data.user_id.toString(), // This fixes the TS error
          data: user.data,
          message: user.message,
          status_code: user.status_code,
        };
      }
    }),

    
  ],
  session: {
    strategy: 'jwt' as 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.data = user.data;
        token.message = user.message;
        token.status_code = user.status_code;
        token.accessToken = user.data.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        data: token.data,
        message: token.message,
        status_code: token.status_code,
      };
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,

}