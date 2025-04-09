import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { config } from "../../../../config/config";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: config.githubClientId as string,
      clientSecret: config.githubSecret as string,
    }),
    GoogleProvider({
      clientId: config.googleClientId as string,
      clientSecret: config.googleSecret as string,
    }),
  ],
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: config.nextAuthSecret,
});

export { handler as GET, handler as POST };
