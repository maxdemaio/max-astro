---
layout: "../../layouts/BlogPost.astro"
fileName: syntax
title: Syntax - The Science of Sentences
pubDate: 'Aug 07 2021'
description: Syntax, the study of word order and how words are put together into larger units.
---

The science of sentences and the relationships between words. Syntax is broadly understood as the study of word order and how words are put together into larger units.

---

## Overview

Most core questions in the scientific domain of linguistics are in these three areas alone (Kumar, 00:00:54 - 00:01:30):

- Structure
- Acquisition
- Change

Syntax focuses on the structure of language and the observation of [how words are ordered](https://en.wikipedia.org/wiki/Word_order).

Let's take the sentence `Max likes Pokémon`. Looking at each word's categorical features, the subject of the sentence is `Max`, the verb is `like`, and the object is `Pokémon`. There is a grammatical relationship between the [constituents](<https://en.wikipedia.org/wiki/Constituent_(linguistics)>). However, these grammatical relationships are only important within sentences. For example, `Max` (a noun) by itself isn't a subject, but when placed in our example sentence it is. You can also note the fact that in English the word sequence is subject, verb, and then object (SVO).

## Word sequence

For all the languages that exist on Planet Earth there is a commonality; sentences have some sequence of word order. We can classify this into how subjects, objects, and verbs interact (edge case: ergative languages can have ambiguous subjects and have [agents](https://en.wikipedia.org/wiki/Ergative%E2%80%93absolutive_alignment) instead). Another cool note is some languages can even have [null subjects](https://en.wikipedia.org/wiki/Null-subject_language). Let's check out all the combinations using Python:

```py
# Get all syntax sequence permutations and print
from itertools import permutations

perm = permutations(['S', 'O', 'V'])
for i in list(perm):
    print(i)
```

```
('s', 'o', 'v')
('s', 'v', 'o')
('o', 's', 'v')
('o', 'v', 's')
('v', 's', 'o')
('v', 'o', 's')
```

**Examples**:

- Modern English (SVO): Pat hit Alex
- Basque (SOV/AOV): Pat-ek Alex egurtu
- Welsh (VSO): Fe darodd Pat Alex

Not all languages fall into the bucket of sticking to a specific word pattern. For example, languages like Russian, Korean, Hungarian, and many others have existing grammar rules that allow one to [change sentence structure](<https://en.wikipedia.org/wiki/Scrambling_(linguistics)>). In reality some languages can have a semi-fluid or fluid word order. These sentence structure changes are highly flexible and reflect the [pragmatics](https://plato.stanford.edu/entries/pragmatics/) of the utterance.

Morphemes can also help distinguish a word's relationship in a sentence. For example, in Latin the sentence `hospes leporem videt` and `hospitem lepus videt` have the same word order but opposite meanings. The first sentence translates to `the host sees the rabbit` and the second translates to `the rabbit sees the host`.

I'd like to also touch upon the difference between grammar and syntax. You might be thinking, what is the difference between grammar and syntax? Well, grammar is a rather wide field which includes syntax. In theoretical linguistics grammar includes syntax, morphology, phonology, phonetics, and semantics (the entire system of spoken language). Without grammar there is no syntax.

## Syntactic models

When researching syntactic models, I realized there are many fields that are progressing on this subject. These models help provide a means to approach how syntactic units and constituents are arranged and represented. The main syntactic models are the following:

- [All syntactic models from Wikipedia](https://en.wikipedia.org/wiki/Syntax)
- [Dependency grammar](https://en.wikipedia.org/wiki/Dependency_grammar)
- [Categorical grammar](https://en.wikipedia.org/wiki/Categorial_grammar)
- [Stochastic/probabilistic grammars/network theories](https://en.wikipedia.org/wiki/Stochastic_grammar)
  - [Statistical machine translation](https://en.wikipedia.org/wiki/Statistical_machine_translation)
- [Functional grammars](https://en.wikipedia.org/wiki/Functional_linguistics)
- [Generative grammar](https://en.wikipedia.org/wiki/Generative_grammar)

## Conclusion

We have dove into the overall understanding of what syntax is as a focus of study. Each syntactic model has an ocean of research behind it to try and understand how syntactic units are categorized in sentences. Every language is different whether it be spoken or signed, but all of them allow for grammatically correct word orders to convey meaning.

## Works Cited

- nptelhrd (Prof. Rajesh Kumar). "Mod-01 Lec-27 Syntax: An Introduction" _YouTube_, 14 Nov. 2014, [https://youtu.be/MYjsn5JtaSg](https://youtu.be/MYjsn5JtaSg).

- nptelhrd (Prof. Rajesh Kumar). "Mod-01 Lec-28 Syntax: An Introduction" _YouTube_, 14 Nov. 2014, [https://youtu.be/06AVRjc0Z6Q](https://youtu.be/06AVRjc0Z6Q).

- CrashCourse. “Syntax 1 - Morphosyntax: Crash Course Linguistics #3” _YouTube_, 25 Sept. 2020, [https://youtu.be/B1r1grQiLdk](https://youtu.be/B1r1grQiLdk).

- CrashCourse. “Syntax 2 - Trees: Crash Course Linguistics #4” _YouTube_, 2 Oct. 2020, [https://youtu.be/n1zpnN-6pZQ](https://youtu.be/n1zpnN-6pZQ).

- "Word order" _Wikipedia_, 10 June 2021, [https://en.wikipedia.org/wiki/Word_order](https://en.wikipedia.org/wiki/Word_order). Accessed 4 July 2021.

- "Syntax" _Wikipedia_, 25 June 2021, [https://en.wikipedia.org/wiki/Syntax](https://en.wikipedia.org/wiki/Syntax). Accessed 4 July 2021.
