ARG DEBIAN_VERSION
FROM debian:${DEBIAN_VERSION}

RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*
