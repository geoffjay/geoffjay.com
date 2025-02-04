FROM golang:latest

RUN go install github.com/air-verse/air@latest

WORKDIR /api

EXPOSE 8080
ENTRYPOINT ["air"]
