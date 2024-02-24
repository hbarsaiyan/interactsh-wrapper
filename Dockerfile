FROM golang:1.22.0-bullseye as builder

WORKDIR /app

RUN mkdir -p /bin

RUN mkdir -p /pkg

RUN GOPATH=/app go install -v github.com/projectdiscovery/interactsh/cmd/interactsh-client@latest

FROM node:20.8.0

WORKDIR /

COPY .env .env

COPY --from=builder /app/bin/interactsh-client /app/bin/interactsh-client

COPY . .

RUN npm install

ENV INTERACTSH=/app/bin/interactsh-client
ENV PORT=8000

EXPOSE 8000

CMD ["node", "app.js"]