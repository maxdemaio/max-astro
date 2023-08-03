---
draft: true
fileName: compiler-ii
title: Nand to Tetris - Compiler II - Code Generation
pubDate: 'Aug 03 2023'
description: 2nd version of the compiler
duration: 8
---

Techniques used:

- Parsing
- Recursive compilation
- code generation
- symbol tables
- memory management

## Code Generation

Here is the roadmap:

![]()

Our objective is to build a full scale compiler. We will do this by extending the basic syntax analyzer and adding code generation abilities.

We will compile one class at a time and deal with:

- class-level code
- sub routine code
  - constructors
  - methods
  - functions

Our challenges will include:

- Handling variables
- expressions
- flow of control
- objects
- arrays

That means, expressing the above semantics in VM code.