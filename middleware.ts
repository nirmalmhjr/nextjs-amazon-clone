import NextAuth from "next-auth";
import authConfig from "./auth.config";

// export const { auth: middleware } = NextAuth(authConfig);
export const middleware  = NextAuth(authConfig).auth;

// export default function middleware(req: Request) {
//   // return NextAuth(authConfig).auth(req);
//   return NextAuth(authConfig).auth;
// }

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
