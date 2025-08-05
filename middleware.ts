import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if(!token) return false;
      return token != null;
  }}
})

// Define paths for which the middleware will run
export const config = {
  matcher: [
    '/dashboard/(.*)',
    // '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}