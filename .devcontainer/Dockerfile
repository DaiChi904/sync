ARG NODE_IMAGE=node:22-bullseye
ARG PNPM_VERSION=10.18.3

FROM ${NODE_IMAGE}

RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@${PNPM_VERSION}
