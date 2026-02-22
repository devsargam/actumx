FROM oven/bun:1 AS base
WORKDIR /app

# Install only runtime dependencies first for better layer caching.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy application source.
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.ts tsconfig.json ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["bun", "run", "src/index.ts"]
