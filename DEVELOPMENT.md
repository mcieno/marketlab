# Development

This document describes the process for running the application locally.

## Prerequisites

[Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

You can optionally use [Træfik](https://containo.us/traefik/) for ease of
exposing the site.
Check out [Træfik & Docker](https://doc.traefik.io/traefik/providers/docker/).

## Develop with Docker Compose

The very first time you set up the project you'll have to install dependencies,
hence run:

```shell
docker compose build
docker compose run --rm -it site poetry install
docker compose run --rm -it site npm install
docker compose run --rm -it site npx playwright install chromium
```

After that, just run:

```shell
docker compose up -d
```

Easy peasy.

If you're using Træfik, the site should be available at [`marketlab.mcieno.internal`](https://marketlab.mcieno.internal).
Otherwise, simply run `docker compose ps` and find out which host port was
assigned to the containers.

## Cheat sheet and examples

This section contains a list of examples showcasing typical development
interactions and operations.

### Run tests

```shell
docker compose exec -it site npm run test
```

### Lint and format

```shell
docker compose exec -it site npm run lint
docker compose exec -it site npm run fmt
```
