# Stage 1: Build
FROM node:21 AS builder 
WORKDIR /server
COPY package*.json ./
COPY prisma/ /prisma/
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:21
WORKDIR /server
COPY --from=builder /server/build ./build
COPY package*.json ./
COPY prisma/ ./prisma/
RUN npm install --omit=dev

ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

CMD ["npm", "run", "start:prod"]