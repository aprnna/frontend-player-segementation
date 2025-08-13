import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token?.accessToken;
    },
  },
})

// Define paths for which the middleware will run
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*'
    // '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}