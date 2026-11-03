FROM alpine:latest
RUN apk add --no-cache ansible-core && \
    ansible-galaxy collection install community.general
WORKDIR /work
