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

## Handling Variables

```
sum = x * (1 + rate)
```

The code generator will take this expression and translate it into VM code.

(pseudo)
```
push x
push 1
push rate
+
*
pop sum
```

But, the VM language does not have symbolic variables. It only has things like local, argument, this, that, and so on. We need to map the symbolic variables onto the virtual memory segments. We need to know (among other things):

- Whether each variable is a `field`, `static`, `local`, or `argument`
- Whether each variable is the first, second third, ... variable of its kind

(actual, make arbitrary assumptions about the variable kinds)
```
push argument 2
push constant 1
push static 0
add
call Math.multiply 2
pop local 3
```

Variable properties:

- name (identifier)
- type (int, char, boolean, class name)
- kind (field, static, local, argument)
- scope (class level, subroutine level)

This bundle of variable properties must be maintained for every variable. How would we do this? Well, I'm here to tell you all we need is a symbol table.

### Symbol Tables

```
class Point {
  field int x, y;
  static int pointCount;

  method int distance(Point other) {
    var int dx, dy;
    let dx = x - other.getx();
    let dy = y - other.gety();
    return Math.sqrt((dx*dx)+ (dy*dy));
  }
  // ...
}
```


| name       | type  |  kind  | # |
|------------|:-----:|:-------|--:|
| x          | int   | field  | 0 |
| y          | int   | field  | 1 |
| pointCount | int   | static | 1 |


