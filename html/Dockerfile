FROM rust as builder
WORKDIR html
ENV USER root
COPY Cargo.lock .
COPY Cargo.toml .
RUN mkdir src
ADD src/main.rs ./src/main.rs
COPY .env .
RUN cargo build

EXPOSE 80
CMD ["target/debug/html"]
