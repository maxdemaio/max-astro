---
draft: true
fileName: operating-sys
title: Operating Systems - Introduction
pubDate: 'Jun 02 2024'
description: 2nd version of the compiler
duration: 8
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

But, when running multiple instances of this program on a single processor, the OS creates the illusion that all programs are running simultaneously. This is achieved by virtualizing the CPU, turning a limited number of physical CPUs into numerous virtual ones, allowing multiple programs to seem as if they are running at once. To manage this, the OS uses interfaces (APIs) to control program execution and implements policies to decide which programs should run when there are conflicts. This makes the OS both a resource manager and a vital interface for interacting with the system:

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

Note when running multiple instances of the above program, they have different process IDs, but they say they have the same address in memory. How is this possible? It's because each process has its own virtual address space that the OS maps onto physical memory. This ensures that memory references in one program do not affect others, giving the illusion that each program has exclusive access to physical memory! But in reality, the OS manages the shared physical memory. This concept is central to memory virtualization.

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

