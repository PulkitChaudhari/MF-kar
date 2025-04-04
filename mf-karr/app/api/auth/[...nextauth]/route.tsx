import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { config } from "../../../../config/config";

// Check for required environment variables
const checkEnvVars = () => {
  console.log(config.apiUrl);
  console.log(config.githubClientId);
  console.log(config.githubSecret);
  console.log(config.googleClientId);
  console.log(config.googleSecret);
  console.log(config.nextAuthSecret);
};

// Call the check function
checkEnvVars();

const handler = NextAuth({
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: config.githubClientId as string,
      clientSecret: config.githubSecret as string,
    }),
    GoogleProvider({
      clientId: config.googleClientId as string,
      clientSecret: config.googleSecret as string,
    }),
  ],
  secret: config.nextAuthSecret,
});

export { handler as GET, handler as POST };
