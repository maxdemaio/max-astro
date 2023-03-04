---
layout: "../../layouts/BlogPost.astro"
title: Networking - The Basics
pubDate: 'June 16 2022'
description: The basics of networking. What is a computer network? How does the internet work?
---

## What Is a Computer Network?

Computers that are connected and share resources represent a [computer network](https://en.wikipedia.org/wiki/Computer_network). This doesn't just mean PCs. This could mean cellphones, printers, and servers. For the network to function, these computers need a means to communicate with each other.

We like computer networks because they let us share data. Whenever you connect two computers you need a way to transmit data between them. This could be done with wifi, physical wires, radio waves, and more.

Well first, what even is data? Data could be a text you want to send to a friend, a scholarly document to share with a professor, a cat video, or a picture of your grandma. All kinds of data like this can be found on the biggest computer network of all, the internet.

## Types of Networks

Computer networks are classified in many different ways. The simplest way to classify them is to classify by reach/size.

- LAN stands for local area network
- MAN stands for metropolitan area network
- WAN stands for wide area network

![Types of networks image](/networking/networks.png)

LANs are for computers that are all in the same building or in very close proximity (from 1km to 10km). Why would we want a LAN? LANs are great for resource sharing. For example, it's a really good strategy for sharing printers on an attached network. Also, if you have a local server you can have everyone on that network have access to it. With everything being local, you get the benefits of speed, low error rate, flexibility, and private ownership.

MANs span one city, county, or metropolitan area. MANs are bigger than LANs. For example, imagine you had two hospitals on opposite sides of a city and a university doing research with those two hospitals in the middle. These organizations could create a computer network to share research, information, or data overall.

WANs go over countries, regions, or even the whole world. A WAN is made up of multiple MANs. The internet is an example of a WAN. 


## Parts of a Network

Networks are primarily made up of 2 parts: nodes and communications media. Nodes represent the devices on a network. Communications media is the means by which those nodes are connected. Communications media can be physical or wireless.

Two important devices help us in networking: routers and modems. Routers make sure that a message sent from a given computer arrives at the right destination computer. Modems turn information from our network into information manageable by telephone infrastructure and vice versa. 

After connecting to the telephone infrastructure, we still need to continue sending messages from our network to the network we want to reach. For this, we will connect our network to an Internet Service Provider (ISP). The ISP can also access other ISPs' routers. The message from our network is carried through the network of ISP networks to the destination network. So, our PCs are clients indirectly connected to the internet with the help of ISPs. The Internet consists of this whole infrastructure of networks.

## How the Internet Works

The internet is the buttress of the web. The web is a service built upon the infrastructure of the internet (there's also others like email and IRC). The internet as mentioned above is a WAN. Data is sent across the internet in packets. The internet uses a packet routing network that follows Internet Protocol (IP) and Transport Control Protocol (TCP). TCP and IP work together to ensure reliable and consistent data transmission. 

Let's say there's a web developer named Buster. Buster creates a nice website with fancy programming languages on their PC. How would Buster deploy this website for all their friends and family to see? Giving people access to Buster's PC would be insecure. But, Buster can store their website (web files) on a web server accessible to everyone on the internet. 

We browse the web using web browsers. Among the computers on the internet infrastructure, some are web servers that can send intelligible messages to web browsers. From the example above, Buster's web server could send messages to a web browser to display their website. 

To send messages to other computers we need to specify which one. Any computer linked to a network has an IP address that uniquely identifies it. Think of IP addresses like postal addresses for houses. We alias IP addresses with domain names so they're easier to find. For example, Google's IP address is `142.250.190.78` but its domain name is just `google.com`.

## Resources

- [Bucky Roberts Networking Playlist](https://www.youtube.com/playlist?list=PL6gx4Cwl9DGBpuvPW0aHa7mKdn_k9SPKO)
- [Mozilla - How The Internet Works](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work)
- [Wikipedia Computer Networking](https://en.wikipedia.org/wiki/Computer_network)
- [LANs research - Pradeepa Wijuntunga](http://web.simmons.edu/~chen/nit/NIT%2792/349-wij.htm)
