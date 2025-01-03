# Step 1: Use a Node.js image to build the Angular app
FROM node:22.12

# Set the working directory
WORKDIR /app

# Copy the rest of the application source code
COPY . .

# Installing dependencies
RUN npm install

# Build the NextJS application
RUN npm run build

EXPOSE 3000

CMD ["npm","start"]

# # Step 2: Use an Nginx image to serve the built app
# FROM nginx:alpine

# # Copy the Angular build output to Nginx's html directory
# COPY --from=build /app/dist/frontend /usr/share/nginx/html

# # Expose port 80 to serve the app
# EXPOSE 80

# # Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]