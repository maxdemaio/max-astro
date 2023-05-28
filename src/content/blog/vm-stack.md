---
fileName: vm-stack
title: Nand to Tetris - Virtual Machine I
pubDate: 'Apr 11 2022'
description: Building a virtual machine and its specification over the Hack computer.
duration: 10
---

In my previous blog posts, we built a computer from the ground up using HDL, assembly, and binary. This was the hardware hierarchy. Now, we'll be diving into the world of software where the assembler bridges this gap.

We'll be going through the 2-tier system used by Java and C#. We'll compile a high-level language, Jack, to virtual machine (VM) language and translate it to assembly. We can swap out our VM translator to suit any platform. In this case it will translate to hack assembly to run on our hack computer.

Demos:

- [VM translator made with Java](https://github.com/maxdemaio/hack-computer/tree/main/vmTranslator)

---

## The Road Ahead

```
class Main {
    function void main() {
        do Output.printString("Hello World!");
        do Output.println(); // New line.
        return;
    }
}
```

This is a high-level program written in Jack. This is an abstraction of what we'd like the computer to understand. What makes this abstraction work is a compiler, virtual machine (VM), assembler, and operating system (OS).

Going forward I'll build a VM, compiler, and OS. We'll be taking a stab at the software hierarchy to gain a full appreciation for high-level programming. We'll build the VM, write an example program in the high-level Jack language, develop a compiler for Jack, and then an operating system.

## Program Compilation

To translate from Jack to VM language we need a compiler. Compilers in a two-tier compilation system compile high-level code to VM language.

You want your high-level program to run on different platforms. But these platforms have different processors with different machine languages. It's not enough to write one compiler.

Write once, run anywhere. Java is the best example of this. Java doesn't compile directly to machine language. It uses two-tier compilation. In the first tier, the Java compiler converts the Java program into byte code aka VM code. This will run on an abstract artifact called a Virtual Machine. In the second tier, we use a JVM implementation to translate the byte code/VM code into the target machine language of the platform.

You need a translator for each platform. But the benefit is that the translation gap is much smaller and we're decoupling this process. We'll compile Jack into VM code, translate the VM code into hack assembly, and assemble it to hack machine code. This will run on our hack computer.

## VM and the Stack (Arithmetic and Logical Commands)

The most important part of our VM abstract architecture is the data structure called a stack. Think of it like a stack of plates or pancakes. It is last in first out (LIFO). You can push items onto the stack or pop them off the top of the stack.

In addition to the stack, we can have memory segments in the VM. With it we can take items from memory and push it to the stack. Also, we can pop items from the stack and store it in the virtual memory segments. These are the fundamental operations to move data between the stack and memory.

We can also perform stack arithmetic. For example, we can pop items from the stack, perform an operation on them, and then push the result of that operation back to the stack. Not only can we do arithmetic, but we can do logical, memory, branching, and function commands.

```
// jack arithmetic
// r = (2-x)+(y+9)
push 2
push x
sub
push y
push 9
add
add
pop r
```

```
// jack logical
// (x<7)or(y==8)
push x
push 7
lt
push y
push 8
eq
or
```

## VM and the Stack (Memory Commands)

We want to take a high-level language like Jack and compile it into VM code.

```
class Bar {
    static int s1, s2;
    function int foo(int x, int y) {
        var int a, b c;
        // ...
        let c = s1 + y;
        // ...
    }
}
```

```
// jack
// let c = s1 + y;
push static 0
push argument 1
add
pop local 2
```

Now, we can have different variable types such as local, static, and argument variables. We need some mechanism to record these differences. We do this by using memory segments of the VM. Our VM won't have a single memory segment, but rather several. The compiler can map variables into these segments based on their types. You can see for example `push static 0` would mean push the 0th element of the static memory segment to the stack.

We lose the variable names while defining these memory segments. But the VM language doesn't need them if we reference our memory segments.

The syntax for pushing/popping items to the stack now becomes:

```
push/pop segment i
```

In total we will have 8 virtual memory segments. These will be: local, argument, this, that, constant, static, pointer, temp. We are coming from a high-level object-oriented language to an intermediate VM code.

We have to place restrictions on pushing and popping now that we've defined all 8 virtual memory sections. With push, `i` must be a non-negative integer and the segment can be any of the 8. With pop, `i` must be a non-negative integer and the segment has to be argument, local, static, this, that, pointer, or temp.

Example code:

Picture the following memory segments (constant just has integers to match each index: 0, 1, 2, etc.)

```
push constant 0
pop local 0
push constant 15
pop local 1
push local 1
push argument 1
gt
pop local 2
push local 0
push argument 0
add
pop local 0
push local 1
push local 1
push constant 1
sub
add
pop local 1
```

After performing these VM language commands the value of local 1 will be 29. You can replicate this by drawing them out on a piece of paper. Push means take the value at index `i` of the memory segment and add it to the stack. Pop means remove the top most element of the stack and move it to index `i` of the memory segment specified. When performing an operation like `add`, you replace the operands in the stack with the result of the operation.

## VM Implementation (Stack)

To carry out the abstraction of the VM we have to use pointer manipulation. Given a typical RAM unit, imagine `p` and `q` as RAM[0] and RAM[1].

```asm
// *p refers to the memory location that p points at
D = *p
```

```hack
@p
A=M
D=M
```

To put in place this concept of pointer manipulation and pointer usage with a VM, we need some ground rules. First, the stack pointer (pointer to top of stack, SP) will be stored in RAM[0]. Second, the stack's base address will be 256. This allows us to use the stack pointer to push/pop values to/from the top address of the stack. We can write commands in assembly to execute this logic of push/pop.

Example where we push a constant of 8 to the stack in assembly:

assembly logic:

```asm
// set top of stack to 8
*SP = 8
// increase stack pointer to next location in RAM
SP++
```

hack assembly (target platform):

```hack
// This automatically goes into the A-reg
// Store the value 8 in the D-register
@8
D=A



// @whateverNumberSpPointsTo (example position 0)
@SP
// causes A to take value of the selected mem reg (0 is ref, other is value [256])
A=M
// Next automatically register selected will come from A reg (value is used as ref)
M=D

@SP // SP++
M=M+1
```

This is how the VM translator will work. We'll take VM language and translate it into the target platform's assembly language. Each VM command will generate several assembly commands.

## VM Implementation (Memory Segments)

Before we discussed that the VM will have 8 memory segments. How will we implement it on the host computer? The abstraction of these memory segments is quite simple with `push/pop segment i`.

The stack will be taken as given from the last section (SP pointer and stack starts at memory location 256). Let's take the local memory segment as an example. The base address of the local segment can be placed anywhere. As long as we remember the base address of local in a pointer called LCL we can do push/pop operations. We access segment[i] by adding the offset to the base address.

Example where we pop from the stack to local[i]:

```asm
addr=LCL+i, SP--, *addr=*SP
```

Example where we push to the stack from local[i]:

```asm
addr=LCL+i, *SP=*addr, SP++
```

Now let's think of a typical program method at runtime in Java. In a class method it will have arguments, local variables, current objects (bundle of member variables), and it might process some array of entries.

When we translate high-level code of a method into VM code, the compiler maps the method's local and argument variables onto the local and argument memory segments. The compiler maps the object fields and array entries that the method is processing to the this and that segments.

We implement all these segments in the same way mentioned above. We keep a pointer to the base address of the memory segment which allows us to push/pop to/from the stack.
Respectively, the pointer names will be SP (stack), LCL (local), ARG (argument), THIS, and THAT. We solve the base address allocation using algorithms, the compiler, and the operating system.

Example `pop segment i`:

```asm
addr=segmentPointer+i, SP--, *addr=*SP
```

Example `push segment i`:

```asm
addr=segmentPointer+i, *SP=*addr, SP++
```

The constant memory segment is truly virtual. There is no allocation need. For pushing a value from the constant memory segment, we would do it directly.

Example `push constant i`:

```asm
*SP = i, SP++
```

Static variables are class level variables that every method can see. They have a higher scope. The compiler maps the static variables into the static segment. For the static segment we need to store the static variable in a global space. For example in the hack computer we can map these references into Ram[16] through Ram[255] using labels like `@Foo.i` from the VM reference `static i` (in file Foo.VM).

We need a temp segment for temporary storage. We’ll have an 8-place fixed memory segment allocated on the host memory. For example Ram[5] to Ram[12]

The pointer segment is weird. We won't need it until we write the compiler. When translating a high-level method to VM code the compiler generates code to keep track of the base addresses of this/that using the pointer segment. Accessing `pointer 0` should give us THIS. Accessing `pointer 1` should give us THAT.

## Conclusion

To create the VM implementation we need a standard VM mapping on the host platform (hack). Basically, we say which registers we will be using for the memory allocation. For example, we mentioned SP will take RAM[0]. Thus, all segments will be mapped. The VM translator will use symbols to achieve this.

| **Symbol**        | **Usage**                                                                |
| ----------------- | ------------------------------------------------------------------------ |
| SP                | Points to memory address within host RAM containing topmost stack value. |
| LCL,ARG,THIS,THAT | Points to base addresses in host RAM of their virtual segments           |
| R13-R15           | Any purpose symbols                                                      |
| Xxx.i symbols     | Each static variable i in file Xxx.VM will be translated to this symbol. |

In conclusion we talked about arithmetic, logical, and memory access commands. We've omitted branching and function commands for future blog posts.

## Resources

- Nisan, Noam, and Shimon Schocken. The Elements of Computing Systems: Building a Modern Computer from First Principles. MIT, 2021.
