# # Step 1: Use a Node.js image to build the Angular app
# FROM node:22.12

# # Set the working directory
# WORKDIR /app

# # Copy the rest of the application source code
# COPY . .

# # Installing dependencies
# RUN npm install

# # Build the NextJS application
# RUN npm run build

# EXPOSE 3000

# CMD ["npm","start"]

# # # Step 2: Use an Nginx image to serve the built app
# # FROM nginx:alpine

# # # Copy the Angular build output to Nginx's html directory
# # COPY --from=build /app/dist/frontend /usr/share/nginx/html

# # # Expose port 80 to serve the app
# # EXPOSE 80

# # # Start Nginx server
# # CMD ["nginx", "-g", "daemon off;"]


# Stage 1: Build
FROM node:22.12 as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG AUTH_GITHUB_CLIENT_ID
ARG AUTH_GITHUB_CLIENT_SECRET
ARG AUTH_GOOGLE_CLIENT_ID
ARG AUTH_GOOGLE_CLIENT_SECRET
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV AUTH_GITHUB_CLIENT_ID=$AUTH_GITHUB_CLIENT_ID
ENV AUTH_GITHUB_CLIENT_SECRET=$AUTH_GITHUB_CLIENT_SECRET
ENV AUTH_GOOGLE_CLIENT_ID=$AUTH_GOOGLE_CLIENT_ID
ENV AUTH_GOOGLE_CLIENT_SECRET=$AUTH_GOOGLE_CLIENT_SECRET

# Log environment variables during build stage
RUN echo "Build stage environment variables:" && \
    echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL" && \
    echo "AUTH_GITHUB_CLIENT_ID: $AUTH_GITHUB_CLIENT_ID" && \
    echo "AUTH_GITHUB_CLIENT_SECRET: $AUTH_GITHUB_CLIENT_SECRET" && \
    echo "AUTH_GOOGLE_CLIENT_ID: $AUTH_GOOGLE_CLIENT_ID" && \
    echo "AUTH_GOOGLE_CLIENT_SECRET: $AUTH_GOOGLE_CLIENT_SECRET"

RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --production
EXPOSE 3000
ARG NEXT_PUBLIC_API_URL
ARG AUTH_GITHUB_CLIENT_ID
ARG AUTH_GITHUB_CLIENT_SECRET
ARG AUTH_GOOGLE_CLIENT_ID
ARG AUTH_GOOGLE_CLIENT_SECRET
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV AUTH_GITHUB_CLIENT_ID=$AUTH_GITHUB_CLIENT_ID
ENV AUTH_GITHUB_CLIENT_SECRET=$AUTH_GITHUB_CLIENT_SECRET
ENV AUTH_GOOGLE_CLIENT_ID=$AUTH_GOOGLE_CLIENT_ID
ENV AUTH_GOOGLE_CLIENT_SECRET=$AUTH_GOOGLE_CLIENT_SECRET

# Log environment variables during production stage
RUN echo "Production stage environment variables:" && \
    echo "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL" && \
    echo "AUTH_GITHUB_CLIENT_ID: $AUTH_GITHUB_CLIENT_ID" && \
    echo "AUTH_GITHUB_CLIENT_SECRET: $AUTH_GITHUB_CLIENT_SECRET" && \
    echo "AUTH_GOOGLE_CLIENT_ID: $AUTH_GOOGLE_CLIENT_ID" && \
    echo "AUTH_GOOGLE_CLIENT_SECRET: $AUTH_GOOGLE_CLIENT_SECRET"

# Add a script that logs environment variables at container startup
RUN echo '#!/bin/sh\necho "Runtime environment variables:"\necho "NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"\necho "AUTH_GITHUB_CLIENT_ID: $AUTH_GITHUB_CLIENT_ID"\necho "AUTH_GITHUB_CLIENT_SECRET: $AUTH_GITHUB_CLIENT_SECRET"\necho "AUTH_GOOGLE_CLIENT_ID: $AUTH_GOOGLE_CLIENT_ID"\necho "AUTH_GOOGLE_CLIENT_SECRET: $AUTH_GOOGLE_CLIENT_SECRET"\nexec "$@"' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "run", "start"]
