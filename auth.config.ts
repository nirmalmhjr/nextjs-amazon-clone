import type { NextAuthConfig } from "next-auth";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/checkout(\/.*)?/,
        /\/account(\/.*)?/,
        /\/admin(\/.*)?/,
      ];

      const pathName = request.nextUrl;
      if (protectedPaths.some((p) => p.test(pathName))) return !!auth;

      return true;
    },
  },
} satisfies NextAuthConfig
