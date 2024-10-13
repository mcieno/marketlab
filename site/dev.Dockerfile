FROM node:20

RUN set -eu \
    && npm i -g npm@10 \
    && npm i -g @playwright/test@1 \
    && playwright install-deps chromium

USER node

RUN set -eu \
    && curl -sSL https://install.python-poetry.org | python3 -

ENV PATH $PATH:/home/node/.local/bin

ENTRYPOINT ["poetry", "run"]
