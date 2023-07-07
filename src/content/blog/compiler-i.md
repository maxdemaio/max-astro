# Compiler I / Syntax Analysis

## Syntax Analysis

Once again, we will revisit the idea of two tier compilation. For example, in Java it first compiles to byte code and in C# it compiles to IL (intermediate language). Jack is no different, it compiles to VM code. After the first compilation step, we take the VM code and translate it, with a VM translator to the target machine language.

I've already written a VM translator. Now, I'm going to approach writing a Jack compiler that turns high-level into VM code. Specifically, in this blog post I'll take about the syntax analysis part of the compiler. To ensure this works, I'll make a program that outputs an XML file. This XML file will show an understanding of all the elements of the input Jack code. This is what I'll be learning:

- Tokenizing
- Grammars
- Parsing
- Parse trees
- XML / mark up
- Compilation
- Handling data

There are two parts to the syntax analyzer we will construct before being able to move on to code generation.

1. Tokenizer
2. Parser

## Lexical Analysis

```
if (x < 0) {
  // prints the sign
  let sign = "negative"
}
```

This above Jack file is a stream of characters. Tokenizing is the act of transforming this primitive stream of characters into a stream of meaningful tokens. See the tokenized output below:

```
if
(
x
)
<
0
{
let
sign
=
"negative"
;
}
```

A token is a string of characters that has a meaning. Different programming languages have different tokens. We need a very well specified documentation of tokens of a language.

For example, in Jack, we have five categories of tokens:

1. keyword
2. symbol
3. integerConstant
4. stringConstant
5. identifier

```xml
<keyword>
if
</keyword>
<symbol>
(
</symbol>
<!-- ... -->
```

## Grammars

A set of valid tokens does not imply that we have a valid input file. Consider this English sentence, "he dog has a." These are all valid tokens, but together they don't make sense. But, the sentence "he has a dog" makes sense.

Not only do the tokens matter, the order matters. Grammar is a set of rules to describe how tokens are arranged to make meaningful statements in the underlying language. The rules fall into two broad categories of terminal rules (constants only) and non-terminal rules (all other rules).

Basic English grammar example:

```
sentence: nounPhrase verbPhrase
nounPhrase: determiner? noun
verbPhrase: verb nounPhrase
noun: 'dog'|'he'
verb: 'has'
determiner : 'a'
```

We'll want to write a Jack compiler using a similar grammar for a Jack program's tokens. This is in the realm of computational linguistics.

## Parse Trees

 Parsing determines if the give input conforms to the grammar. Through parsing, we get the complete morphology or grammatical structure of the given input. 

 In the process we construct a grammatical structure known as a parse tree:

![parse tree english](/compiler-i/)

Unlike programming languages, the parsing of natural languages like English can be very ambiguous. Looking at sentences there could be many interpretations of a parse tree.

> Time flies like an arrow

Possible interpretations:

1. Time passes so quickly, that it flies like an arrow. 
2. There is a certain species of insects, called “time flies”, and those insects happen to like a particular arrow.
3. Use a stop watch to time the flight of flies, just like you time the flight of an arrow.

But, we will focus on the grammar of the Jack programming language. With it, we can construct parse trees as well.

![jack parse tree]()

We will use this parse tree to generate XML / mark up that describes the structure of the data in a readable format.

```
if (x < 153)
{let city = "Paris";}
```

```xml
<tokens>
  <keyword> if </keyword>
  <symbol> ( </symbol>
  <identifier> x </identifier>
  <symbol> &lt; </symbol>
  <integerConstant> 153
  </integerConstant>
  <symbol> ) </symbol>
  <symbol> { </symbol>
  <keyword> let </keyword>
  <identifier> city </identifier>
  <symbol> = </symbol>
  <stringConstant> Paris
  </stringConstant>
  <symbol> ; </symbol>
  <symbol> } </symbol>
</tokens>
```

## Parser Logic

We'll be creating a class with a set of `compileXXX` methods, one for almost each non-terminal rule `XXX` in the Jack grammar. The handling of some rules is embedded in other rules. We will construct this method by following exactly what the right hand side of the rule dictates. This assumes the input is already tokenized.

- Follow right-hand side of rule and parse input accordingly
- If the right-hand side specifies a non-terminal rule `XXX`, call `compileXXX`
- Do this recursively

To develop the syntax analyzer, we'll use the grammar of the Jack language as the recipe to write the code of the parser. Note, an LL grammar can be parsed by a recursive descent parser without backtracking (once you start advancing, you don't have to do back). LL(k) parsers need to look ahead at most k tokens in order to determine which rule is applicable. LL(1) is as soon as you have a particular token in hand, you know which rule to apply .

```
let x = 5 + foo - a       // program 1. Here foo represents a simple variable.
let y = foo[12] - 3     // program 2. Here foo represents an array.
let z = 2 * foo.val()   // program 3. Here foo represents an object.
```

We have to read one more token.  If it’s `[`, we know that we have an array reference. If it’s `.`, we know that we have a method call. Otherwise, it must be a simple variable.  This is the only case in the Jack language in which the parser has to look ahead one more token. Except for this one case, Jack is an LL(1) language. 


## Jack Grammar