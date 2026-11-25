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

## Simulating CPU and I/O Overlap

The OSTEP process simulator makes the value of switching on I/O concrete. It runs a list of processes, each a mix of CPU instructions and I/O requests, and reports how busy the CPU and the I/O device were. A few scenarios tell the whole story.

**Two CPU-bound processes.** With no I/O at all, CPU utilization is 100%. There is nothing to overlap.

**CPU-bound first, then I/O.** The first process takes 4 ticks of CPU. The second issues an I/O, which takes 1 tick to start, 5 ticks to complete, and 1 tick to acknowledge. Nothing runs during the wait, so the I/O time is pure idle:

```
Stats: Total Time 11
Stats: CPU Busy 6 (54.55%)
Stats: IO Busy  5 (45.45%)
```

**I/O first, then CPU-bound.** Issue the I/O first and that process blocks, which lets the CPU-bound process run while the device works. Total time drops from 11 ticks to 7, and both resources are busier:

```
Stats: Total Time 7
Stats: CPU Busy 6 (85.71%)
Stats: IO Busy  5 (71.43%)
```

**Switching on I/O disabled.** With `SWITCH_ON_END` instead of `SWITCH_ON_IO`, the OS refuses to switch away from a blocked process. The idle CPU goes unused and we are back to 11 ticks. Turning switching back on restores the 7-tick result. This is the whole motivation for the blocked state.

**When to resume after I/O completes.** There is a second policy choice: whether a process whose I/O just finished runs immediately (`IO_RUN_IMMEDIATE`) or waits its turn (`IO_RUN_LATER`). With a process that issues several I/Os alongside CPU-heavy siblings, running later means the I/O-issuing process does not get back on the CPU until the others finish, so all of its remaining I/O is pushed to the end with nothing to overlap:

```
Stats: Total Time 31
Stats: CPU Busy 21 (67.74%)
Stats: IO Busy  15 (48.39%)
```

Running it immediately lets it issue the next I/O right away, which keeps the device busy in the background while the CPU-bound processes continue:

```
Stats: Total Time 21
Stats: CPU Busy 21 (100.00%)
Stats: IO Busy  15 (71.43%)
```

The pattern holds across random process mixes. `SWITCH_ON_IO` lets the CPU do useful work while a process is blocked, and `IO_RUN_IMMEDIATE` favors the process most likely to issue more I/O, which keeps both resources overlapped. Together they are a simple, effective scheduling policy.

## Summary

A process is a running program. Now that we understand the abstraction, we can get into the details about low-level mechanisms to implement processes and the high-level policies needed to schedule them intelligently. With mechanisms and policies, we will understand how an OS virtualizes the CPU!
