---
fileName: jenks
title: Jenkins Container That Uses Docker on a M1 Mac
pubDate: 'Mar 04 2023'
description: How to run a Jenkins container that uses Docker on a M1 Mac
duration: 4
---

Let's say we would like to build Docker images inside a Jenkins container for the CI/CD process. In my research, I came across two approaches to do so: DooD (Docker-outside-of-Docker) and DinD (Docker-in-Docker).

DinD is where a complete and isolated version of Docker is installed inside a container.

The DooD approach involves mounting the host machine's Docker socket to the Jenkins container. With this, Jenkins can start new sibling containers. The sibling containers will run alongside the Jenkins container on the host machine.

By adding the Docker package to the image and adding the Jenkins user to the Docker group, we provide the permissions and dependencies for Jenkins to run Docker commands. But since Jenkins is running in a container, it does not have direct access to the host's Docker daemon. Mounting the host's Docker socket allows the container to communicate with the host's Docker daemon. Thus, Jenkins can run Docker commands. Below, I'll go over how to do this DooD approach.

## Setup

Build a custom image based off the official `jenkins/jenkins` image. This will include Docker in the container. See my Dockerfile:

```docker
# Set the base image for the new image
FROM jenkins/jenkins:lts
# sets the current user to root. 
# This is necessary bc some of the following commands need root privileges.
USER root
# Update the package list on the image
RUN apt-get update && \
    # Install the packages for adding the Docker repo and installing Docker
    apt-get install -y apt-transport-https \
                       ca-certificates \
                       curl \
                       gnupg2 \
                       software-properties-common && \
    # Download the Docker repository key and add it to the system
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    # Add the Docker repository to the system
    add-apt-repository \
      "deb [arch=arm64] https://download.docker.com/linux/debian \
      $(lsb_release -cs) \
      stable" && \
    # Update the package list again to include the new repository
    apt-get update && \
    # Install the Docker CE package
    apt-get install -y docker-ce && \
    # Add the Jenkins user to the Docker group so the Jenkins user can run Docker commands
    usermod -aG docker jenkins
```

```
docker build -t myjenkins-arm64 .
```

When running the container we mount a local folder, `jenkins`, on the host machine to the `/var/jenkins_home` directory within the Jenkins container. This is so that the data stored by Jenkins will persist across container restarts. I made this folder like so:

```
cd ~
```

```
mkdir jenkins
```

Start a docker container running Jenkins which has access to the host machine's docker daemon (host volume). We will then run the docker-compose file like so:

```yaml
version: '3'

services:
  jenkins:
    image: myjenkins-arm64
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - ~/jenkins:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
```


```
docker-compose up
```

## Plugin Installation 

Run and configure the Jenkins application so you can log in. Then, install the Jenkins `docker` plugin and the `docker-pipeline` plugin within the application.

Then, you configure the `docker` plugin through `Manage Jenkins->Manage Nodes and Clouds->Configure Clouds->Add Docker`

- Docker Host URI: `unix:///var/run/docker.sock`
- Make sure you check 'Enabled'

To configure the `docker-pipeline` plugin through `Manage Jenkins->Global Tool Configuration->Add Docker`

- Docker version: latest
- Download from docker.com

## Jenkinsfile

If you want to test to see if it works, you can create a simple Maven-based Java project and add a Jenkins file at the root like:

```
// Jenkinsfile (Declarative Pipeline)
// Requires the Docker Pipeline plugin
// Requires the Docker plugin
pipeline {
    agent { docker { image 'maven:3.8.7-eclipse-temurin-11' } }
    stages {
        stage('build') {
            steps {
                sh 'mvn --version'
            }
        }
    }
}
```

Create a new multibranch pipeline for the repo by linking the Git repo to it. Then you can have the Jenkins pipeline run, pull an image of Maven, and use it to build and test your project!

---

## Ongoing Notes

It's important to note that exposing your host Docker socket is not advisable. Additionally, DinD is now considered a public archive. Therefore, it's recommended to look into other alternatives. Most likely, you'll need to isolate the environment in which Jenkins is running.

One option is to create a virtual machine, install Docker on it, and then run a Jenkins container inside the VM with access to the VM's Docker daemon. Alternatively, you could have a dedicated node for running the Jenkins container to minimize the risk of compromising the entire system if someone gains access.

## Resources 

- https://stackoverflow.com/questions/35110146/can-anyone-explain-docker-sock
- https://www.lvh.io/posts/dont-expose-the-docker-socket-not-even-to-a-container/
- https://dev.to/petermbenjamin/docker-security-best-practices-45ih#docker-engine
- https://blog.container-solutions.com/running-docker-in-jenkins-in-docker
- https://medium.com/@manav503/how-to-build-docker-images-inside-a-jenkins-container-d59944102f30
- https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/