---
fileName: os-direct
title: Operating Systems - Limited Direct Execution - Virtualization
pubDate: 2024-10-25
description: example
duration: 5
resources:
  [
    {
      title: "Operating Systems: Three Easy Pieces",
      url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    },
  ]
draft: true
---

To virtualize the CPU we need to implement time sharing. We must do this without adding overhead to the system. We also have to do this with control over the CPU in mind. To do so, both hardware and operating system support will be required.

## Limited Direct Control

"Direct execution" just means run it directly on the CPU: create a process entry in the process list, allocate memory for the process, load the program code into memory from disk, locate the `main()` routine or entry point, jumps to it and starts executing the code.

Problems:

- How can we confirm this program won't do anything we don't want it to do? (all while still runnning efficiently)
- How does the OS stop a program from running and switch to another process, thus implementing the time sharing we require to virtualize the CPU?

## Restricted Operations

Without limits on running programs, the OS wouldn’t be in control of anything and would just be a library! We need to solve how the OS can allow processes to perform I/O and other restricted operations without giving the process complete control over the system.

When you call `open()` or `read()` in C, it looks like a normal procedure call. That's because it is. But, hidden in these procedure calls is the famous **trap instruction**. For example, when you call `open()` you are executing a procedure call into the C library. The library uses an agreed-upon calling convention with the kernel to put the arguments to `open()` on well known locations (stack or specific registers). Also, it'll put the system call number in a well known location (stack or specific registers). After, it executes the trap instruction. 

The approach taken to not let any process do what it wants is to have different modes. Code that runs in **user mode** is restricted in what in can do. Code that runs in **kernel mode** (which the OS runs in) can do what it likes, including privlidged operations. In genereal, system calls allow the kernel to carefully expose key pieces of the underlying hardware architecture to user programs: accessing the file system, creating and destroying processes, communicating with other processes, and allocating more memory.

How does the trap know where to run code in the OS? Well, the kernel sets up a **trap table** at boot time. There are two phases in limited direct execution (LDE) protocol:

1. At boot time the kernel initializes the trap table and the CPU remembers it for later use.
2. The kernel sets up a node in the process list, allocates memory, then executes the return-from-trap instruction to start the process. Then, the CPU is switched to user mode and begins running the process. When the process makes a system call, it traps into the OS, which handles it and returns control. After completing its work and exiting (e.g., via the exit() system call), the OS cleans up, and execution ends.

## Switching Between Processes

This should just be a fancy game of red light green light, right? Eh, not so much. How can the operating system regain control of the CPU so that it can
switch between processes? Because if a process is running on the CPU, that means the OS can't be running on it.