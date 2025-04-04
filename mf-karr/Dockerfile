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
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --production
EXPOSE 3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV AUTH_GITHUB_CLIENT_ID=$AUTH_GITHUB_CLIENT_ID
ENV AUTH_GITHUB_CLIENT_SECRET=$AUTH_GITHUB_CLIENT_ID
ENV AUTH_GOOGLE_CLIENT_ID=$AUTH_GITHUB_CLIENT_ID
ENV AUTH_GOOGLE_CLIENT_SECRET=$AUTH_GITHUB_CLIENT_ID
CMD ["npm", "run", "start"]
