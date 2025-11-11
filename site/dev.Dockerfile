# syntax=docker/dockerfile:1
FROM node:24-bookworm

RUN set -eu \
    && npm i -g npm@11 \
    && npm i -g @playwright/test@1 \
    && playwright install-deps chromium

USER node

COPY --from=ghcr.io/astral-sh/uv:debian /usr/local/bin/uv /usr/local/bin/uv

ENV UV_LINK_MODE copy
ENV PATH $PATH:/home/node/.local/bin

ENTRYPOINT ["uv", "run"]
