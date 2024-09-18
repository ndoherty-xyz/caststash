FROM node:22-alpine

WORKDIR /app

# Production node environment
ENV NODE_ENV=production

# Next.js on railway doesn't include .env at build time, need to copy public env vars
ARG NEXT_PUBLIC_NEYNAR_CLIENT_ID
ENV NEXT_PUBLIC_NEYNAR_CLIENT_ID $NEXT_PUBLIC_NEYNAR_CLIENT_ID

# Upgrade yarn version
ENV YARN_VERSION=4.5.0
RUN yarn policies set-version $YARN_VERSION

RUN corepack enable

# Copy the package.json, and yarn.lock files
COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./

RUN yarn install

COPY . .

# Generate prisma schema 
RUN yarn db:gen

# Add sharp from alpine image for nextjs image optimization
RUN yarn add sharp

# Set port provided by railway
ARG PORT

# Expose the port 
EXPOSE $PORT

RUN yarn build

CMD ["sh", "-c", "sleep 3 && yarn start"]