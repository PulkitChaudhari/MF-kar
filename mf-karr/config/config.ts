export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "backend",
  googleClientId: process.env.AUTH_GOOGLE_CLIENT_ID,
  googleSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  githubClientId: process.env.AUTH_GITHUB_CLIENT_ID,
  githubSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
  nextAuthSecret: process.env.NEXT_AUTH_SECRET,
  nextAuthUrl: process.env.NEXTAUTH_URL,
};
