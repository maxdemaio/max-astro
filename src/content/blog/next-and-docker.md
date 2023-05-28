---
fileName: next-and-docker
title: Next.js and Docker
pubDate: 'Dec 11 2021'
description: How to use Next.js and Docker together.
duration: 5
---

In this blog post I'm introducing a dangerously good application development duo, Next.js and Docker. To start, I'll briefly go over both Next.js and Docker. After, I'll explain how you can combine these two technologies. Let's get this party `docker start`ed!

---

## Next.js

[Next.js](https://nextjs.org/) is an open-source React framework built on top of Node.js. Next.js leverages a wide array of functionalities such as hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. In fact, [This website](https://github.com/maxdemaio/max-nextjs) was built using Next.js!

Curious about giving it a try? Next.js has a [step-by-step tutorial](https://nextjs.org/learn/basics/create-nextjs-app) on building your first app. To get a Next.js app up and running in seconds you can use `npx create-next-app@latest` or `yarn create next-app`. Also, if you get stuck you can visit the [Create Next App documentation](https://nextjs.org/docs/api-reference/create-next-app). There are even [official Next.js templates](https://github.com/vercel/next.js/tree/canary/examples) you can snag.

## Docker

[Docker](https://www.docker.com/) is an open platform for developing, shipping, and running apps. Before Docker, you had to locally set up your app and all of its dependencies according to your machine. Docker eliminates this issue by packaging and running apps in loosely isolated environments called containers.

Docker also has a [great overview on their website](https://docs.docker.com/get-started/overview/).

### Docker Command Starter Kit

Here are the most useful commands I found to get you up and running with Docker. For more detailed information on each command and all other commands you can visit [Docker's documentation](https://docs.docker.com/engine/reference/commandline/docker/).

- `docker login` - log in to local registry or Docker Hub
- `docker pull IMAGE` - pulls an image from Docker Hub (default registry), but you can specify a different one
- `docker push IMAGE` - pushes an image to Docker Hub (default registry), but you can specify different one
- `docker images` - gives you a list of images on the host machine
- `docker run IMAGE` - creates a Docker container of the specified Docker image and starts it in the current terminal
- `docker stop CONTAINER` - stops a given container
- `docker start CONTAINER` - starts a given container
- `docker ps` - status of all running containers
- `docker ps -a` - status of all running and not running containers
- `docker logs CONTAINER` - gives the logs of a given container
- `docker exec [OPTIONS] CONTAINER COMMAND [ARG...]` - runs a command in a running container
- `docker network ls` - see all available Docker networks
- `docker network create example-network` - creates a network
- `docker build -t IMAGE:tag dockerfile-location` - builds an image from the specified Dockerfile and will then tag it
- `docker rm CONTAINER` - deletes a container
- `docker rmi image` - deletes an image
- `docker version` - provides docker version information

## Next.js and Docker

Let's say you've crafted yourself a performant, stunning, and interactive Next.js application.

Once you create a Dockerfile for your Next.js application, you can use it to create a Docker image and then a Docker container. To create an image, we use `docker build` and then to create a container we use `docker run`. Take for example this Dockerfile I use to create an image of this website which should apply to most Next.js apps:

```docker
# Building image
# docker build . -t example-image-name

# Install dependencies only when needed
FROM node:14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node_modules/.bin/next", "start"]
```

You can see how the Dockerfile's instructions create layers to form the resulting image.

Consider this set of instructions where each instruction creates one layer:

- `FROM` creates a layer from the `node:14-alpine` Docker image
- `RUN` [adds missing shared libraries to our image](https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine)
- `WORKDIR` sets the working directory for any subsequent instructions
- `COPY` adds our dependency blueprints (package.json/yarn.lock) from the Docker client’s current directory
- `RUN` installs all of our Next.js application's dependencies with yarn

Let's use this Dockerfile to get our Next.js app running on a container. Place the Dockerfile in the outermost directory of your Next.js application. Now, we can run `docker build . -t example-image-name` in that outermost directory of the Next.js application to forge an image! Finally with the command `docker run -p3000:3000 example-image-name` you can create a container. After using the `docker run` command you can actually view your app running on the container. With your image and container you are poised to deploy to any Docker hosting platform.

## Conclusion

To summarize, we've learned about what Next.js and Docker are and how you can use them together. Next.js is a leading frontend framework with a phenomenal developer experience. Docker is an open platform for development and ops best practices. Docker also has collaboration features such as `docker push` and `docker pull` to run images on any machine. If you're looking to share and deploy beautiful frontend applications, these two technologies definitely are the life of the party.
