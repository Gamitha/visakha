FROM node:22-alpine

# Install build dependencies for native modules (sharp, bcrypt)
RUN apk add --no-cache python3 make g++ vips-dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies in a separate directory that won't be overwritten by volume mounts
RUN npm install

# Store the correctly compiled node_modules
RUN mv node_modules /app-node_modules

# Copy source code
COPY . .

# Create entrypoint script that copies node_modules if missing
RUN printf '#!/bin/sh\nset -e\n\n# Copy pre-built node_modules if not present\nif [ ! -f /app/node_modules/.docker-built ]; then\n  echo "Copying pre-built node_modules..."\n  cp -a /app-node_modules/. /app/node_modules/\n  touch /app/node_modules/.docker-built\nfi\n\n# Generate Prisma client\nnpx prisma generate\n\nexec "$@"\n' > /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
