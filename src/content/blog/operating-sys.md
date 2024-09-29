---
fileName: operating-sys
title: Operating Systems - Introduction
pubDate: 'Sep 29 2024'
description: Introduction to operating systems
duration: 7
resources:
  [
    {
      title: "Operating Systems: Three Easy Pieces",
      url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    },
  ]
---

An operating system (OS) is a crucial piece of software that manages a computer's hardware and resources, enabling programs to run efficiently and users to interact with the system. At its core, a running program executes instructions, following the Von Neumann model of computing. The OS simplifies system use by virtualizing physical resources, transforming them into more flexible and user-friendly virtual forms. It provides interfaces (APIs) for programs to access memory, devices, and other functions, effectively acting as both a virtual machine and a resource manager, ensuring efficient and fair allocation of the CPU, memory, and other resources.

## Virtualizing the CPU

```c
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

int main(int argc, char *argv[])
{
    if (argc != 2) {
	fprintf(stderr, "usage: cpu <string>\n");
	exit(1);
    }
    char *str = argv[1];

    while (1) {
	printf("%s\n", str);
	Spin(1);
    }
    return 0;
}
```

Let’s say we save the program above as `cpu.c` and decide to compile and run it on a system with a single CPU. Here is what we will see:

```
prompt> gcc -o cpu cpu.c -Wall
prompt> ./cpu "A"
A
A
A
A
ˆC
prompt>
```

But, when running multiple instances of this program on a single processor, the OS creates the illusion that all programs are running simultaneously. This is achieved by virtualizing the CPU, turning a limited number of physical CPUs into numerous virtual ones, allowing multiple programs to seem as if they are running at once. To manage this, the OS uses APIs to control program execution and implements policies to decide which programs should run when there are conflicts. This makes the OS both a resource manager and a vital interface for interacting with the system:

```
prompt> ./cpu A & ./cpu B & ./cpu C & ./cpu D &
[1] 7353
[2] 7354
[3] 7355
[4] 7356
A
B
D
C
A
B
D
C
A
```

## Virtualizing Memory

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

int main(int argc, char *argv[]) {
    if (argc != 2) { 
	fprintf(stderr, "usage: mem <value>\n"); 
	exit(1); 
    } 
    int *p; 
    p = malloc(sizeof(int));
    assert(p != NULL);
    printf("(%d) addr pointed to by p: %p\n", (int) getpid(), p);
    *p = atoi(argv[1]); // assign value to addr stored in p
    while (1) {
	Spin(1);
	*p = *p + 1;
	printf("(%d) value of p: %d\n", getpid(), *p);
    }
    return 0;
}
```

```
prompt> ./mem
(2134) address pointed to by p: 0x200000
(2134) p: 1
(2134) p: 2
(2134) p: 3
(2134) p: 4
(2134) p: 5
ˆC
```

```
prompt> ./mem & ./mem &
[1] 24113
[2] 24114
(24113) address pointed to by p: 0x200000
(24114) address pointed to by p: 0x200000
(24113) p: 1
(24114) p: 1
(24114) p: 2
(24113) p: 2
(24113) p: 3
(24114) p: 3
(24113) p: 4
(24114) p: 4
...
```

Note when running multiple instances of the above program, they have different process IDs, but they say they have the same address in memory. How is this possible? It's because each process has its own private virtual address space that the OS maps onto physical memory. This ensures that memory references in one program don't affect others, giving the illusion that each program has exclusive access to physical memory! But in reality, the OS manages the shared physical memory. This concept is central to memory virtualization.

## Concurrency

Concurrency means working on many things at once in the same program. Concurrency isn't limited to just the OS itself. In fact, there are programs that can be multi-threaded that exhibit similar problems. The below is an example of a multi-threaded program:

```c
#include <stdio.h>
#include <stdlib.h>
#include "common.h"
#include "common_threads.h"

volatile int counter = 0; 
int loops;

void *worker(void *arg) {
    int i;
    for (i = 0; i < loops; i++) {
	counter++;
    }
    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc != 2) { 
	fprintf(stderr, "usage: threads <loops>\n"); 
	exit(1); 
    } 
    loops = atoi(argv[1]);
    pthread_t p1, p2;
    printf("Initial value : %d\n", counter);
    Pthread_create(&p1, NULL, worker, NULL); 
    Pthread_create(&p2, NULL, worker, NULL);
    Pthread_join(p1, NULL);
    Pthread_join(p2, NULL);
    printf("Final value   : %d\n", counter);
    return 0;
}
```

The `main` function creates two threads using `Pthread_create()`. A thread is an execution context, which includes all the information a CPU needs to execute a series of instructions. Think of it like reading a book. If you take a break from reading: you can write down the page, line, and word number so you can pick up exactly where you left off later.

Then, a friend could take the book while you're not using it, and resume reading from where they stopped using the same technique. Then you can take it back, and resume it from where you were. In a similar way, threads allow the CPU to switch between different tasks, giving the illusion of doing multiple things at once by spending a bit of time on each task and saving the 'execution context' of each one.

You can think of a thread as a function running within the same memory space as other functions, with more than one of them active at a time. In this example, each thread starts running a function called `worker()`, where it increments a counter in a loop for a specified number of iterations.

```
prompt> gcc -o threads threads.c -Wall -pthread
prompt> ./threads 1000
Initial value : 0
Final value : 2000
```

When the two threads are finished, they will have both incremented the counter `N` times. The final value of the counter would be `2N` and we see that with the above result being 2000. But, things aren't always that simple.

```
prompt> ./threads 100000
Initial value : 0
Final value : 143012 // huh??
prompt> ./threads 100000
Initial value : 0
Final value : 137298 // what the??
```

In the above runs, we gave an input value of 100000 but then instead of a final value of 200000 we got 143012 and then 137298. Sometimes, you might even get the right answer. What's happening here?

"The reason for these odd and unusual outcomes relate to how instructions are executed, which is one at a time. Unfortunately, a key part of the program above, where the shared counter is incremented, takes three instructions: one to load the value of the counter from memory into a register, one to increment it, and one to store it back into memory. Because these three instructions do not execute **atomically** (all at
once), strange things can happen" (Arpaci-Dusseau 9). I'll address this problem of concurrency in greater detail later.

## Persistence

DRAM store values in a volatile way. If you turn off your computer, any data in memory is lost. So, we need hardware and software to store data persistently since users care about their data!

Hard drives and SSDs are a common ways to store data long term. The software in the OS that manages these is called the file system. Note, the OS doesn't create a private, virtualized disk for each application.

```c
#include <stdio.h>
#include <unistd.h>
#include <assert.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <string.h>

int main(int argc, char *argv[]) {
    int fd = open("/tmp/file", O_WRONLY | O_CREAT | O_TRUNC, S_IRUSR | S_IWUSR);
    assert(fd >= 0);
    char buffer[20];
    sprintf(buffer, "hello world\n");
    int rc = write(fd, buffer, strlen(buffer));
    assert(rc == (strlen(buffer)));
    fsync(fd);
    close(fd);
    return 0;
}
```

Fortunately, as seen above, the OS has a standard ways to access devices through its system calls. most file systems incorporate some kind of write protocol, such as journaling or copy-on-write. These protocols will carefully
order writes to disk to ensure that if a failure occurs during the write
sequence, the system can recover to reasonable state afterwards.

