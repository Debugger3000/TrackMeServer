
# Use official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package manifests first (better layer caching)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy rest of the application
COPY . .

# Expose the port your Elysia server listens on (default 3000)
EXPOSE 3000

# Start the server
CMD ["bun", "run", "prod"]
