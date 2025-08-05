import NextAuth from "next-auth"
import { AuthOptions } from "@/utils/authOptions";

const handler = NextAuth(AuthOptions)

export { handler as GET, handler as POST };