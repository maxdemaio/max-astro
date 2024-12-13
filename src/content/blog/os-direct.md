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

To virtualize the CPU we need to implement time sharing. We must do this without adding overhead to the system. Then, we also have to do this with control over the CPU in mind. To do so, both hardware and operating system support will be required.

## Limited Direct Control

"Direct execution" just means run it directly on the CPU: create a process entry in the process list, allocate memory for the process, load the program code into memory from disk, locate the `main()` routine or entry point, jumps to it and starts executing the code.

Problems:

- How can we confirm this program won't do anything we don't want it to do? (all while still runnning efficiently)
- While we'r