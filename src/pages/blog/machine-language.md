---
layout: "../../layouts/BlogPost.astro"
title: Nand to Tetris - Machine Language
pubDate: 'Jan 17 2022'
description: All about machine language.
---

Machine language is any low level programming language that has machine language instructions. These instructions control a computer's central processing unit (CPU).

---

## Machine Languages

There is a universality in technology. The same hardware can run many different software programs. The most primitive form of a program is a sequence of instructions in binary. These sequences cause our hardware to apply the functionality of the program.

How do we specify these sequences of instructions? We need operations, program counters, and addressing. We could write programs in binary but it would be very difficult. High-level languages compile into machine language for hardware to understand its instructions.

To learn how to build a computer we need to deal directly with machine language. It's very good for optimized code because we can tell the hardware exactly what we want. Programs can be written at a low level to reap the benefits of [hardware acceleration](https://en.wikipedia.org/wiki/Hardware_acceleration).

Instruction: 010001000110010

- ADD: 0100010
- R3: 0011
- R2: 0010

Now instead of coding in binary we can use symbolic assembly language. This assembly language will have an assembler program to convert it into its binary counterpart. Throughout this blog post I will be detailing [hack assembly](<https://en.wikipedia.org/wiki/Hack_computer#Instruction_set_architecture_(ISA)_and_machine_language>).

```asm
ADD R2, R1, R3
```

## Machine Language Elements

Machine languages are the most important interface in the world of computer science. It allows software to speak with the hardware. What are the operations our hardware should perform? Where should we get the data? How is the program controlled? This is all answered by machine language.

Throughout these sequences of instructions accessing memory is costly. We need to supply a long address to get data and supplying its contents to the CPU is slow. A solution to this is having a memory hierarchy.

A memory hierarchy consists of a small memory that is easy to access and fast. This is the cache. The main memory is larger and less cheap to access. Then the slowest memory can sit on disk. The farther away we get from the ALU/CPU the more expensive it becomes to get that data.

Also, the CPU usually contains a few accessible registers. They are central to machine language. Not only can we use them to store data, but we can store addresses in them.

Addressing Modes:

```asm
// R2 <- R2 + R1
// Register
Add R1, R2
```

```asm
// Mem[200] <- Mem[200] + R1
// Direct
Add R1, M[200]
```

```asm
// Mem[A] <- Mem[A] + R1
// Indirect
Add R1, @A
```

```asm
// R1 <- R1 + 73
// Immediate
Add 73, R1
```

Input and output devices interact with the CPU with drivers. Drivers know the protocol on how to talk to the CPU. Example I/O devices would be a keyboard, mouse, camera, screen, and many more. This can work by memory mapping locations specific to the I/O devices.

When the CPU executes these machine instructions in sequence there is a flow control. Occasionally we need to jump unconditionally to another location to loop. We can also do condition jumps to check if conditions are met.

## The Hack Computer and Machine Language

The Hack Computer is a 16-bit machine.

![Hack Computer Diagram](/nand-tetris/Hack_Diagram.png)

**Hardware**

- Data memory (RAM): a sequence of 16-bit registers (RAM[0], RAM[1], RAM[2], ...)
- Instruction memory (ROM): a sequence of 16-bit registers (RAM[0], RAM[1], RAM[2], ...)
- CPU: performs 16-bit instructions
- Instruction bus / data bus / address buses

**Software**

- Hack machine language
- 16-bit A instructions
- 16-bit C instructions
- Hack program: sequence of instructions written in the Hack machine language

**Control**

- ROM is loaded with a Hack program
- Reset button is pushed
- Program begins running

**Registers**

- CPU has two registers close to it, A (data or address) and D (data) registers
- The RAM can also be called the M register (addressed by A)

We can write machine languages in two different flavors. We can write machine language in symbolic language or binary code.

```asm
@17
D+1;JLE
```

```
0000000000010001
1110011111000110
```

The symbolic language is translated into binary code (assembler) which can then be executed by the computer.

### Syntax (Symbolic)

**A-instruction**

- `@value` (non-negative decimal or symbol referring to such a constant):

```asm
// Set RAM[100] to -8
@100 // A=100
M=-8 // RAM[100] = -8
```

This will set the A-register to 100. Then RAM[100] becomes the selected RAM register (M). Then RAM[100]'s value becomes -8.

**C-instruction**

- `dest = comp ; jump` (destination and jump are optional)
- comp field is any computation out of a fixed set of computations
- dest field is where the computation result will be stored
- jump directive if(comparing jump to 0) jumps to execute the instruction in ROM[A]

```asm
// Set RAM[12] to the value of the D register minus 1
@12 // A=12
M=D-1 // RAM[12]=D-1
```

```asm
// If (D-1==0) then jump to execute instruction stored in ROM[68]
// Check to terminate loop pretty much
@68 // A=56
D-1;JEQ // if (D-1==0) goto 56
```

## Input/Output

Computers have input and output devices. For example, a keyboard can enter inputs and a screen can display outputs. I/O devices get data from users and display data to them. That's why coding applications is so rewarding. we can manipulate the computer to do what we'd like! Controlling the I/O beast, aka the computer.

So, how would we manipulate the screen? We can use a screen memory map/matrix. This is a designated area of the RAM. The physical display unit will refresh many times per second from the memory map. If we change these bits, we can change the display.

Our keyboard is connected to a keyboard memory map/matrix. It represents the keyboard inside the computer. Only a 16-bit register is necessary. When a key is pressed on the keyboard, the key's [scancode](https://en.wikipedia.org/wiki/Scancode) is sent into the memory map.

## Conclusion

The hack assembly language is symbolic with two types of instructions (A/C). An assembler translates the symbolic assembly language into binary code. After, the computer executes the binary code.

The hack programming language is low level. A low level programming language deals with:

- Working with registers and memory
- Branching
- Variables
- Iteration
- Pointers
- Input/Output

## Resources

- Nisan, Noam, and Shimon Schocken. The Elements of Computing Systems: Building a Modern Computer from First Principles. MIT, 2021.
