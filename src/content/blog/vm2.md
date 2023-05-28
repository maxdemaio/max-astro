---
fileName: vm2
title: Nand to Tetris - Virtual Machine II
pubDate: 'May 11 2022'
description: Building a virtual machine and its specification over the Hack computer.
duration: 8
---

In my first blog post on building a virtual machine, we went over arithmetic, logical, and mem segment commands. But this is a limited view of programming. For example, `push`, `pop`, `add`, and `sub` are all linear.

In this blog post we'll complete the implementation of the virtual machine. This includes branching, arithmetic, logical, memory access, and function commands.

Demos:

- [VM translator V2 made with Java](https://github.com/maxdemaio/hack-computer/tree/main/vmTranslator2)

---

Arithmetic/Logical commands:

- add
- sub
- neg
- eq
- gt
- lt
- and
- or
- not

Memory segment commands:

- pop _segment i_
- push _segment i_

## Program Control

The flow of the program takes twists and turns.

```
x = -b + sqrt(power(b,2) - 4 * a * c)
```

We can make a method for `power(b,2) - 4 * a * c` to calculate the discriminant:

```
x = -b + sqrt(disc(a,b,c))
```

These are all abstractions. We can invent new subroutines. We can also branch based on conditions:

```
if !(a==0)
    x = (-b + sqrt(disc(a,b,c)))/(2*a);
else
    x = -c/b;
```

Branching commands:

- goto _label_
- if-goto _label_
- label _label_

Function commands:

- call _function_
- function _function_
- return

This high-level language compiles into VM code, gets translated into assembly, then translated into binary by an assembler.

## Branching

Without branching, programs would be linear. With branching we can change the flow of control of the program. Forward, backward, looping, you name it and we can do it with branching.

There are two kinds of branching, unconditional and conditional.

Conditional (requires pushing condition to the stack before an if-goto command):

- if-goto _label_
- _cond_ = pop;
- if _cond_ jump to execute the command after _label_.

Unconditional we goto/jump to a different position in the program. But we wouldn't need a condition.

## Functions

We extend high-level programming languages using:

- Methods
- Subroutines
- Functions
- Procedures
- etc.

All these can classify as functions. With a primitive function like `add` or `sub` we can create abstract functions for ourselves in VM language. If you want to call a function that expects `n` arguments, you push them onto the stack, and you call the function. After performing the logic on the arguments, the return value of the function should replace these `n` arguments on the stack. That is a function.

When we call a function during runtime, we have to:

- Pass parameters of the calling function to the called function
- Determine the return address with the caller's code
- Save the caller's return address, stack, and memory segments
- Jump to execute the called function

When the called function returns, we have to:

- Return to the caller the value computed by the called function
- Recycle the memory resources used by the called function
- Bring back the state of the caller's stack and memory segments
- Jump to the return address in the caller's code

## Function, Call, and Return

Now I'll show some examples of a high-level program translating at compile time to VM language.

Example high level program:

```
class Main {
    function int main() {
        return Main.factorial(3);
    }

    function int factorial(int n) {
         if (n = 1) {
            return 1;
        }
        else {
            return Math.multiply(n, Main.factorial(n-1));
       }
    }
}
```

Example Pseudo VM code:

```
function main
    push 3
    call factorial
    return

function factorial(n)
    push n
    push 1
    eq
    if-goto BASECASE
    push n
    push n
    push 1 // have n on stack and give (n-1) to factorial
    sub
    call factorial
    call mult // or could use OS's multiply
    return

label BASECASE
    push 1
    return

function mult(a,b)
    // ...
```

Actual VM program:

```
function Main.main 0
push constant 3
call Main.factorial 1
return
function Main.factorial 0
push argument 0
push constant 1
eq
if-goto IF_TRUE0
goto IF_FALSE0
label IF_TRUE0
push constant 1
return
goto IF_END0
label IF_FALSE0
push argument 0
push argument 0
push constant 1
sub
call Main.factorial 1
call Math.multiply 2
return
label IF_END0
```

Here is what the global stack would look like at runtime before reaching the base case of factorial(3).

| global stack                      |
| --------------------------------- |
| _ref arg0_ 3                      |
| _return address_ saved main frame |
| _f(3)_ 3                          |
| _f(3)_ and _ref arg0_ 2           |
| _return address_ saved f(3)       |
| _f(2)_ 2                          |
| _f(2)_ and _ref arg0_ 1           |
| _return address_ saved f(2)       |
| _f(1)_ 1                          |

Since we do `call factorial 1` we know that there is only one argument passed to the factorial function. So, we'd reference the top most value in the scoped stack to `argument 0` for `factorial(3)`.

After reaching the base case, the program would resume back at the `call mult 2` line for each subroutine (except `main()`). Then, we'd copy the return value onto `argument 0` for each scoped stack.

The final result would be:

```
3 * 2 * 1
```

The main function pushed 3 to the stack, called factorial, and got 6!

From the caller's point of view, it expects the following:

- Before calling a function, we must push as many arguments as the function needs to the stack
- We invoke the function using `funcName nArgs`
- After the function returns, the argument values pushed onto the stack disappears. Then we replace with a `return value` (always exists) at the top of the stack
- After the function returns, all memory segments should be in to the same state as they were before the call (but `temp` is undefined and `static` may have changed).

From the callee's perspective it expects the following:

- `argument` segment has been initialized with arguments passed by the caller
- `local` variable segment has been allocated and initialized as 0s
- Static segment has been set to the `static` segment of the VM file (class) to which the callee belongs
- Memory segments `this`, `that`, `pointer`, and `temp` are undefined upon entry.
- Working stack is empty
- Before returning, a value must be pushed onto the stack. Void functions still return a value like 0. It's the caller's responsibility to do something with this value. If the caller knows it called a function who's return value is void, it can simply toss away the return value.

## VM Translator

The VM translator reads VM code and translates it into assembly. In our case, it's hack assembly. But I'll show pseudo assembly code so it's platform independent. Keep in mind that most VM language is written by compilers. Functions from classes are denoted as `className.functionName`.

So, something like:

```
function Foo.main 4
    // ...
    // computes -(16 * (local 3))
    push constant 16
    push local 3
    call Bar.mult 2
    neg
    // ...

function Bar.mult 2
    // Returns product of two arguments
    // ...
    push local 1
    return
```

Would be translated to something like:

```asm
(Foo.main)
    // setup of function exec
    // function exec
    // ...
    // asm for push constant 16
    // asm for push locla 3
    // asm to save caller's state
    // setup for function call
    goto Bar.mult // in asm
(Foo$ret.1)
    // asm that handles neg
    // ...

(Bar.mult)
    // setup of func exec
    // function exec
    // ...
    // asm for push local 1
    // asm that moves return value to caller,
    // reinstates the caller's state, and then:
    goto Foo$ret.1 // in asm
```

### Handling call

`call functionName nArgs` calls the `functionName` and says `nArgs` have been pushed to the stack. When we encounter this VM command, `call functionName nArgs`, there's a few things we need to do.

Pseudo assembly code (generated by the VM translator):

```asm
    push returnAddress // using declared label below
    push LCL // saves LCL of caller
    push ARG // saves ARG of caller
    push THIS // saves THIS of caller
    push THAT // saves THAT of caller
    ARG = SP - 5 - nArgs // reposition ARG
    LCL = SP // reposition LCL
    goto functionName // program control shift to function
(returnAddress) // declare label for return address
```

### Handling function

`function functionName nVars` is the starting point for a function that has `nVars` local variables in VM language.

Pseudo assembly code (generated by the VM translator):

```asm
(functionName) // create label for function start
    // repeat nVars times:
    push 0 // allocate and init local segment with 0s
```

### Handling return

`return` is the VM command that indicates to end the current function and go back to the return address with a return value.

Pseudo assembly code (generated by the VM translator):

```asm
endFrame = LCL // endFrame is a temp variable
retAddr = *(endFrame - 5) // get return address

// return value copied onto ARG[0]
// reposition return value for caller
// grabs return value from top of stack
*ARG = pop()

SP = ARG + 1 // reposition SP of caller back to normal

// restore state of caller
THAT = *(endFrame-1)
THIS = *(endFrame-2)
ARG = *(endFrame-3)
LCL = *(endFrame-4)
goto retAddr // cont program control at return address in caller
```

## Summary

I showed the assembly code that would end up building the state of a global stack. This global stack gets built through turns in program control from functions. We maintain and build this global stack during program runtime.

We've gone over how to make a VM on any target platform. We test our VM translator using VM test programs, a CPU emulator, and test/compare scripts. We'll take a directory of Jack files, compile to VM language files, and translate into one assembly file. In our case the project will for the hack computer. But we could use these general guidelines to take VM code and generate assembly for other platforms. Platform independence is pretty sweet!

## Resources

- Nisan, Noam, and Shimon Schocken. The Elements of Computing Systems: Building a Modern Computer from First Principles. MIT, 2021.
