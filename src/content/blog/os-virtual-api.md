---
fileName: os-virtual-api
title: Operating Systems - Process API - Virtualization
pubDate: 'Oct 17 2024'
description: Operating systems process API and virtualization
duration: 8
resources:
  [
    {
      title: "Operating Systems: Three Easy Pieces",
      url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    },
  ]
---

In this post, I will go over process creation in Unix systems. Unix systems create processes with a pair of system calls: `fork()` and `exec()`. Then, `wait()` can be used to wait for a process the OS has created to complete.

> What interfaces should the OS present for process creation and control? How should these interfaces be designed to enable powerful functionality, ease of use, and high performance?


## `fork()` System Call

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int
main(int argc, char *argv[])
{
    printf("hello world (pid:%d)\n", (int) getpid());
    int rc = fork();
    if (rc < 0) {
        // fork failed; exit
        fprintf(stderr, "fork failed\n");
        exit(1);
    } else if (rc == 0) {
        // child (new process)
        printf("hello, I am child (pid:%d)\n", (int) getpid());
    } else {
        // parent goes down this path (original process)
        printf("hello, I am parent of %d (pid:%d)\n",
	       rc, (int) getpid());
    }
    return 0;
}
```

```
prompt> ./p1
hello world (pid:56458)
hello, I am parent of 56459 (pid:56458)
hello, I am child (pid:56459)
prompt>
```

The interesting part of the code begins when we call `fork()`. The OS provides this to create a new process. The process created is almost an exact copy of the currently running program calling `fork()`. The newly created process does not start running at `main()`, rather, it comes into life as if it just called fork itself. The value `fork()` returns to the caller is the PID of the newly-created child. Meanwhile, the child receives a return code of zero. The order of the output is non-deterministic.

## `wait()` System Call

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int
main(int argc, char *argv[])
{
    printf("hello world (pid:%d)\n", (int) getpid());
    int rc = fork();
    if (rc < 0) {
        // fork failed; exit
        fprintf(stderr, "fork failed\n");
        exit(1);
    } else if (rc == 0) {
        // child (new process)
        printf("hello, I am child (pid:%d)\n", (int) getpid());
	sleep(1);
    } else {
        // parent goes down this path (original process)
        int wc = wait(NULL);
        printf("hello, I am parent of %d (wc:%d) (pid:%d)\n",
	       rc, wc, (int) getpid());
    }
    return 0;
}
```

```
hello world (pid:64264)
hello, I am child (pid:64265)
hello, I am parent of 64265 (wc:64265) (pid:64264)
```

Assuming we are running on a machine with a single CPU, then in the previous program without `wait()` either the child or parent might run at the point since there would be two active processes (non-deterministic). In this new example, we have the parent to wait for the child process to finish. Adding a `wait()` call to the code above makes the output deterministic. This is because now we know the child will always print first.

## `exec()` System Call

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int
main(int argc, char *argv[])
{
    printf("hello world (pid:%d)\n", (int) getpid());
    int rc = fork();
    if (rc < 0) {
        // fork failed; exit
        fprintf(stderr, "fork failed\n");
        exit(1);
    } else if (rc == 0) {
        // child (new process)
        printf("hello, I am child (pid:%d)\n", (int) getpid());
        char *myargs[3];
        myargs[0] = strdup("wc");   // program: "wc" (word count)
        myargs[1] = strdup("p3.c"); // argument: file to count
        myargs[2] = NULL;           // marks end of array
        execvp(myargs[0], myargs);  // runs word count
        printf("this shouldn't print out");
    } else {
        // parent goes down this path (original process)
        int wc = wait(NULL);
        printf("hello, I am parent of %d (wc:%d) (pid:%d)\n",
	       rc, wc, (int) getpid());
    }
    return 0;
}
```

```
hello world (pid:65451)
hello, I am child (pid:65452)
      32     123     966 p3.c
hello, I am parent of 65452 (wc:65452) (pid:65451)
```

The `exec()` system call is useful for calling another program different from the calling program. However, the cool thing about the `exec()` program is that it doesn't spin off a new process. It actually loads code (and static data) from that executable and overwrites the current code segment (and current static data) with it. So, the heap/stack and other parts of the memory spaces are re-initialized. After the `exec()` in the child process above, it's like `p3.c` never ran; a successful call to `exec()` never returns.

## Motivating the API

The separation of `fork()` and `exec()` is essential in building a UNIX shell, because it lets the shell run code after the call to `fork()` but before the call to `exec()`. The shell is just a program with a prompt you can type commands into. Usually you do that with the name of an executable and some arguments for it. The shell (running program) then calls `fork()` to create a new child process to run the command, calls some variant of `exec()` to run that command, and waits for the command to complete with `wait()`. After the child completes your shell is ready to go again.

Thanks to the separation of `fork()` and `exec()` you can do cool things like:

```
prompt> wc p3.c > newfile.txt
```

You can also do cool things with pipes like:

```
grep -o foo file | wc -l
```

## Process Control and Users

There are also other interfaces for interacting with processes on UNIX systems. We can send signals to processes to pause, continue, kill, or other useful imperatives. The signal subsystem allows us to send external events to processes as well as entire process groups.

## Summary

Note, it's important to take everything with a grain of salt. It's noted in the book that "a recent paper by systems researchers from Microsoft, Boston University, and ETH in Switzerland details some problems with `fork()`, and advocates for other, simpler process creation APIs such as `spawn()`." Also, more research may come out in the future improving upon the UNIX process API.

## Homework

> 1. Write a program that calls fork(). Before calling fork(), have the main process access a variable (e.g., x) and set its value to something (e.g., 100). What value is the variable in the child process? What happens to the variable when both the child and parent change the value of x?

- The variables of the child process and the parent process have their own independent values since they have their own private memory address spaces.

> 2. Write a program that opens a file (with the open() system call) and then calls fork() to create a new process. Can both the child and parent access the file descriptor returned by open()? What happens when they are writing to the file concurrently, i.e., at the same time?

- They are both able to write to the file that was opened via the `open()` system call. If writing concurrently, the file will contain both the parent's and child's messages, but the order and how the writes are interleaved can vary.

> 3. Write another program using fork(). The child process should print “hello”; the parent process should print “goodbye”. You should try to ensure that the child process always prints first; can you do this without calling wait() in the parent?

- Yes, another deterministic way to ensure that the parent process runs after the child process is by using inter-process communication (IPC) methods, such as pipes, signals, or shared memory. One simple approach would be for the child to signal the parent when it has completed its task, allowing the parent to wait for that signal before proceeding.

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>

void sigchld_handler(int signum) {
    // Handler for SIGCHLD - this will be triggered when the child terminates
    printf("Child process finished (received SIGCHLD)\n");
}

int main(int argc, char *argv[]) {
    printf("hello world (pid:%d)\n", (int)getpid());
    
    // Set up the signal handler for SIGCHLD
    signal(SIGCHLD, sigchld_handler);

    int rc = fork();
    
    if (rc < 0) {
        // fork failed; exit
        fprintf(stderr, "fork failed\n");
        exit(1);
    } else if (rc == 0) {
        // child (new process)
        printf("hello, I am child (pid:%d)\n", (int)getpid());
        sleep(1);
        exit(0);
    } else {
        // parent process
        // pause the parent, waiting for a signal (SIGCHLD from child)
        pause();
        printf("goodbye, I am parent of %d (pid:%d)\n", rc, (int)getpid());
    }
    
    return 0;
}
```

> 4. Write a program that calls fork() and then calls some form of exec() to run the program /bin/ls. See if you can try all of the variants of exec(), including (on Linux) execl(), execle(), execlp(), execv(), execvp(), and execvpe(). Why do you think there are so many variants of the same basic call?

- Variants of `exec()` differ in the way they accept arguments and how they search for the program to be executed.

> 5. Now write a program that uses wait() to wait for the child process to finish in the parent. What does wait() return? What happens if you use wait() in the child?

- The `wait()` system call should only be used in the parent process to wait for the child to finish. If you call `wait()` in the child process, there is no child for it to wait for, and the call will fail, returning `-1`.

> 6. Write a slight modification of the previous program, this time using waitpid() instead of wait(). When would waitpid() be useful?

- `waitpid()` is useful when you want to: Wait for a specific child process or 
implement more control over the waiting behavior, such as not blocking the parent indefinitely.

> 7. Write a program that creates a child process, and then in the child closes standard output (STDOUT FILENO). What happens if the child calls printf() to print some output after closing the descriptor?

- When the child process closes `STDOUT_FILENO` and then tries to use `printf()`, the output will be lost because there is no open file descriptor associated with standard output. Normally, `printf()` sends output to `STDOUT`, but since it's closed, the output is discarded.

> 8. Write a program that creates two children, and connects the standard output of one to the standard input of the other, using the pipe() system call.

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    int pipefd[2];  // Array to hold the pipe file descriptors
    pid_t pid1, pid2;

    // Create a pipe
    if (pipe(pipefd) == -1) {
        perror("pipe failed");
        exit(1);
    }

    // Fork the first child
    pid1 = fork();
    if (pid1 < 0) {
        perror("fork failed");
        exit(1);
    } else if (pid1 == 0) {
        // First child process: write to the pipe

        // Close the read end of the pipe, as the first child only writes
        close(pipefd[0]);

        // Write some data to the pipe
        char message[] = "Hello from the first child!\n";
        write(pipefd[1], message, sizeof(message) - 1);  // Writing to pipefd[1]

        // Close the write end after writing
        close(pipefd[1]);

        // Exit the first child
        exit(0);
    }

    // Fork the second child
    pid2 = fork();
    if (pid2 < 0) {
        perror("fork failed");
        exit(1);
    } else if (pid2 == 0) {
        // Second child process: read from the pipe

        // Close the write end of the pipe, as the second child only reads
        close(pipefd[1]);

        // Read the data from the pipe
        char buffer[100];
        int bytesRead = read(pipefd[0], buffer, sizeof(buffer) - 1);  // Reading from pipefd[0]
        if (bytesRead >= 0) {
            buffer[bytesRead] = '\0';  // Null-terminate the string
            printf("Second child received: %s", buffer);
        } else {
            perror("read failed");
        }

        // Close the read end after reading
        close(pipefd[0]);

        // Exit the second child
        exit(0);
    }

    // Parent process: close both ends of the pipe
    close(pipefd[0]);
    close(pipefd[1]);

    // Wait for both children to finish
    wait(NULL);  // Wait for the first child
    wait(NULL);  // Wait for the second child

    return 0;
}
```