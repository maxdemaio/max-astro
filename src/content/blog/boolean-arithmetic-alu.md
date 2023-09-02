---
fileName: boolean-arithmetic-alu
title: Nand to Tetris - Boolean Arithmetic & the ALU
pubDate: 'Dec 27 2021'
description: How gate logic works and specification for the ALU.
duration: 4
---

In this blog post I'll describe gate logic designs that represent numbers and perform
arithmetic operations on them. The previous blog post we talked about what logic gates are. Now, we'll use logic gates to arrive at a fully functional Arithmetic Logical Unit.

---

## Binary Numbers

For n bits, you can have 2^n possible binary combinations. With binary we can represent numbers. For example, if you wanted to know the value of "101" of binary in decimal form you would do (2^2 \* 1 + 2^1 \* 0 + 2^0 \* 1).

| Decimal | Binary |
| ------- | ------ |
| 0       | 0      |
| 1       | 1      |
| 2       | 10     |
| 3       | 11     |
| 4       | 100    |

## Binary Addition

Binary numbers can be added digit by digit from right to left, with the same method as decimal addition. If the last bit-wise addition generates a carry of 1, we can report overflow; otherwise, the addition completes successfully. Subtraction comes for free once we learn how to use negative binary numbers. Multiplication and division I'll postpone until we use software.

### Adders

- Half adder: adds two bits
- Full adder: adds three bits
- Adder: adds two numbers

We can implement all of these adders as chips in HDL. The goal is to build up to a multi-bit adder. An example of this would be 16 full adders together or 15 full adders and 1 half adder. This would result in out=(a+b) where everything is a 16-bit integer and overflow is ignored. We could code the implementations for half/full adders and be set to add any n-sized bit binary number.

## Negative Numbers

To represent negative numbers in binary, almost all computers use what's known as 2's complement or the radix complement. The complement of a binary digit x would be (2^n - x).
If x is 0 it would just remain as 0. For all combinations 2^n, the maximum would be (2^(n-1) - 1) and the minimum would be (-2^(n-1)). Another trick to get -x from x is to leave all trailing 0s intact, keep the least significant 1 bit intact, then flip all the remaining bits to the left (remaining).

| Positive Decimal | Positive Binary | Negative Binary | Negative Decimal |
| ---------------- | --------------- | --------------- | ---------------- |
| 0                | 0000            |                 |                  |
| 1                | 0001            | 1111            | -1               |
| 2                | 0010            | 1110            | -2               |
| 3                | 0011            | 1101            | -3               |
| 4                | 0100            | 1100            | -4               |
| 5                | 0101            | 1011            | -5               |
| 6                | 0110            | 1010            | -6               |
| 7                | 0111            | 1001            | -7               |
|                  |                 | 1000            | -8               |

We then get subtraction for free because you can add any number against a negative number which is the same as subtracting!

## Arithmetic Logic Unit (ALU)

From the [von Neumann architecture](https://en.wikipedia.org/wiki/Von_Neumann_architecture), a core part to a computer's CPU is the ALU. A general abstraction of an ALU is that it takes two multi-bit inputs, a function to be computed (pre-defined, arithmetic, and logical), and creates an output. Examples of arithmetic operations would be integer addition, multiplication, subtraction, etc. Examples of logical operations would be And, Or, Xor, etc.

![von Neumann architecture](../../../public/nand-tetris/von_structure.png)

The Hack ALU which I'll implement to build a computer will have the following components:

- Takes two 16-bit two's complement values as input
- Outputs a 16-bit two's complement value
- Which function to compute is set by six 1-bit inputs (opcodes)
- Computes one out of a family of 18 functions
- Also outputs two 1-bit control outputs to explain the main output

You can use a truth table to show the complete specification for this ALU.

| out  |
| ---- |
| 0    |
| 1    |
| -1   |
| x    |
| y    |
| !x   |
| !y   |
| -x   |
| -y   |
| x+1  |
| y+1  |
| x-1  |
| y-1  |
| x+y  |
| x-y  |
| y-x  |
| x&y  |
| x\|y |

## Conclusion

The way I described the construction of a multi-bit adder was standard with no attention to efficiency. Actually, even the adder implementation is rather inefficient because of delays when carrying over bits. However, these shortcomings can be allayed by using logic circuits that use look-ahead techniques. Low-level improvements can drastically help out the computer. The overall functionality of a computer is derived from the ALU and the OS that runs on top of it. Making our computer involves design trade-offs with implementing functions at the ALU level and the software level. In the next blog post, we'll start to focus on RAM.

## Works Cited

- Nisan, Noam, and Shimon Schocken. The Elements of Computing Systems: Building a Modern Computer from First Principles. MIT, 2021.
