# Stage 1: Build
FROM oven/bun:canary-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN bun tsc

# Stage 2: Production
FROM oven/bun:canary-alpine AS runner

# Set the working directory in the container
WORKDIR /app

# Install only production dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the compiled JavaScript files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy any additional files required for runtime (e.g., .env, public files)
COPY --from=builder /app/package.json /app/bun.lockb ./

# Expose the port your app will run on
EXPOSE 8080

# Set the environment variable for production
# ENV NODE_ENV=production

# Command to start the application
CMD ["node", "dist/index.js"]
