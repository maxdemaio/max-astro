---
fileName: os-virtual-abstraction
title: Operating Systems - Process Abstraction - Virtualization
pubDate: 2024-09-30
description: Operating systems process abstraction and virtualization
duration: 5
resources:
  [
    {
      title: "Operating Systems: Three Easy Pieces",
      url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    },
  ]
---

A process is one of the most fundamental abstractions that the operating system (OS) provides. A process is a running program. The program itself is a file waiting on disk that is ready to spring into action.

**How do we provide the illusion of multiple CPUs?**

The OS creates this illusion by virtualizing the CPU. This is a technique known as **time sharing** the CPU. To do this, the OS needs two things: low-level machinery mechanisms and high-level intelligence.

For example, context switching allows the OS to stop running one program and start running another on a given CPU. This is a time sharing mechanism employed by modern OSes. On top of these mechanisms you'll find the intelligence of the OS in the form of policies. Policies are algorithms for the OS to make decisions.

## Processes

What makes up a process? Well let's get into what comprises **machine state**, what a computer can read or update when it's running:
  - program counter (PC) or the instruction pointer (IP) which tells us which instruction to execute next
  - stack pointer and associated frame pointer manage the stack for function parameters, local variables, and return addresses
- its memory (address space)

## Process API

These APIs in some form are available on any modern OS:

- create
- destroy
- wait
- miscellaneous control
- status

## Process Creation

How are programs transformed into processes? To start, we need to load the program's code and any static data (variables) into memory and into the address space of the process. This loading is done lazily, but we'll get into that more when we talk about **paging** and **swapping**.

Then, memory must be allocated for the program's **run-time stack** (variables, function parameters, and return addresses). Then, the OS may allocate memory for the program's **heap**. The OS also has to do some initialization tasks related to I/O (input/output). All of this then sets the stage for the execution of a program.

## Process States

Now we'll get into what different states a process can be in while running:
- running
- ready
- blocked

Here's an example with two processes running that only use the CPU and no I/O:

| Time | Process0 | Process1 | Notes               |
|------|----------|----------|---------------------|
| 1    | Running  | Ready    |                     |
| 2    | Running  | Ready    |                     |
| 3    | Running  | Ready    |                     |
| 4    | Running  | Ready    | Process0 now done   |
| 5    | –        | Running  |                     |
| 6    | –        | Running  |                     |
| 7    | –        | Running  |                     |
| 8    | –        | Running  | Process1 now done   |

An example with I/O, with decisions being made by the **scheduler**:

| Time | Process0 | Process1 | Notes                      |
|------|----------|----------|----------------------------|
| 1    | Running  | Ready    |                            |
| 2    | Running  | Ready    |                            |
| 3    | Running  | Ready    | Process0 initiates I/O      |
| 4    | Blocked  | Running  | Process0 is blocked,        |
| 5    | Blocked  | Running  | so Process1 runs            |
| 6    | Blocked  | Running  |                            |
| 7    | Ready    | Running  | I/O done                   |
| 8    | Ready    | Running  | Process1 now done           |
| 9    | Running  | –        |                            |
| 10   | Running  | –        | Process0 now done           |

## Data Structures

The OS itself is a program. So, it has key data structures that track various relevant pieces of information:
- process list
- register context (for context switching)

## Summary

A process is a running program. Now that we understand the abstraction, we can get into the details about low-level mechanisms to implement processes and the high-level policies needed to schedule them intelligently. With mechanisms and policies, we will understand how an OS virtualizes the CPU!

## Homework Answers

1. The usage is 100% since both processes use the CPU 100% of the time with no I/O
2. The first process takes 4 ticks, then 1 tick to issue the I/O, then 5 ticks to complete the I/O, and then 1 tick to specify the I/O is done. So:

```
Stats: Total Time 11
Stats: CPU Busy 6 (54.55%)
Stats: IO Busy  5 (45.45%)
```

3. Since we issue the I/O call first, that process becomes blocked letting the other process run. So, the I/O process takes 1 tick on the CPU to start running, the and the CPU process takes over and uses the CPU for 4 ticks, finally the CPU is idle for 1 tick, then 1 tick to specify the I/O is done. So:

```
Stats: Total Time 7
Stats: CPU Busy 6 (85.71%)
Stats: IO Busy  5 (71.43%)
```

4. We once again arrive at a total time of 11 when switching is disabled since the idle CPU cannot be used:

```
Stats: Total Time 11
Stats: CPU Busy 6 (54.55%)
Stats: IO Busy  5 (45.45%)
```

5. With switching on (default but here we specified it with a flag) we get a more optimal result like before:

```
Stats: Total Time 7
Stats: CPU Busy 6 (85.71%)
Stats: IO Busy  5 (71.43%)
```

6. We initiate the first I/O instruction but then don't switch back to it until the CPU is ready again. This ends up saving all the rest of the I/O for the end since the subsequent processes are using 100% of the CPU. Then at the end it can finally issue the final I/O calls. This isn't efficient since you could've had more I/O going on in the background while the CPU was being used.

```
Stats: Total Time 31
Stats: CPU Busy 21 (67.74%)
Stats: IO Busy  15 (48.39%)
```

7. When we can immediately switch to run the I/O process that finished, we get more background I/O going and can more efficient use both CPU and I/O:

```
Stats: Total Time 21
Stats: CPU Busy 21 (100.00%)
Stats: IO Busy  15 (71.43%)
```

8. For this one it really depends on the seed of the process list. But, I noted having `IO_RUN_IMMEDIATE` since that process that issued I/O will likely have more we can run in the background and `SWITCH_ON_IO` is beneficial because you can switch to other tasks while other processes are blocked by I/O.