---
layout: "../../layouts/BlogPost.astro"
title: Host, Anonymous, and Named Docker Volumes
pubDate: 'Mar 04 2023'
description: Different Docker volume types explained.
---

What are the differences between host, anonymous, and named Docker volumes? In this blog post, we will explore their differences as well as their advantages and disadvantages.

## Host volumes

A host volume can be accessed from within a Docker container and is stored on the host. To create a host volume, run:

```
docker run -v /path/on/host:/path/in/container
```

## Anonymous volumes

The location of anonymous volumes is managed by Docker. It can be difficult to refer to the same volume when it is anonymous. To create an anonymous volume, run:

```
docker run -v /path/in/container
```

Although anonymous volumes provide flexibility, they are not used as often now that named volumes have been introduced.

## Named volumes

Named volumes and anonymous volumes are similar because Docker manages where they are located. However, named volumes can be referred to by name. To create a named volume, run:

```
docker volume create somevolumename
docker run -v somevolumename:/path/in/container
```

Like anonymous volumes, named volumes provide flexibility, but they are also explicit, which makes them easier to manage.

You can also specify Docker volumes in your `docker-compose.yaml` file using the same syntax as the examples above.

## Resources

- [https://spin.atomicobject.com/2019/07/11/docker-volumes-explained/](https://spin.atomicobject.com/2019/07/11/docker-volumes-explained/)