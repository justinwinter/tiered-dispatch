// Code task suite — deterministic exec graders via vm sandbox.
// Each task: prompt, rubric flags, hidden test cases. Original tasks.

import { makeTask, gradeCode } from '../tasks.js';

const T = (id, prompt, flags, testCases) =>
  makeTask({
    id: `code:${id}`,
    category: 'code',
    prompt,
    flags,
    answerKey: 'hidden tests',
    grader: (answer) => gradeCode(answer, testCases),
  });

export const codeSuite = [
  T(
    'even-sum',
    'Write a function `main(arr)` that returns the sum of all even numbers in an array of integers. Return 0 for an empty array.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
    [
      { input: [[1, 2, 3, 4]], expected: 6 },
      { input: [[2, 4, 6]], expected: 12 },
      { input: [[]], expected: 0 },
      { input: [[1, 3, 5]], expected: 0 },
      { input: [[-2, 0, 5, 8]], expected: 6 },
    ],
  ),
  T(
    'fizzbuzz',
    'Write a function `main(n)` that returns an array of strings for numbers 1..n: "Fizz" if divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if both, else the number as a string.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
    [
      { input: [15], expected: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'] },
      { input: [1], expected: ['1'] },
      { input: [3], expected: ['1', '2', 'Fizz'] },
      { input: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'] },
    ],
  ),
  T(
    'anagram',
    'Write a function `main(a, b)` that returns true if two strings are anagrams (same letters, any order, case-insensitive, ignoring spaces).',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
    [
      { input: ['listen', 'silent'], expected: true },
      { input: ['hello', 'world'], expected: false },
      { input: ['Clint Eastwood', 'old west action'], expected: true },
      { input: ['a', 'a'], expected: true },
      { input: ['', 'x'], expected: false },
    ],
  ),
  T(
    'dedupe',
    'Write a function `main(arr)` that returns a new array with duplicates removed, preserving first-occurrence order.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
    [
      { input: [[1, 2, 2, 3, 1]], expected: [1, 2, 3] },
      { input: [['a', 'b', 'a', 'c', 'b']], expected: ['a', 'b', 'c'] },
      { input: [[]], expected: [] },
      { input: [[5]], expected: [5] },
    ],
  ),
  T(
    'matrix-transpose',
    'Write a function `main(matrix)` that returns the transpose of a rectangular 2D array of numbers.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
    [
      { input: [[[1, 2, 3], [4, 5, 6]]], expected: [[1, 4], [2, 5], [3, 6]] },
      { input: [[[1]]], expected: [[1]] },
      { input: [[[1, 2]]], expected: [[1], [2]] },
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[1, 4, 7], [2, 5, 8], [3, 6, 9]] },
    ],
  ),
  T(
    'word-count',
    'Write a function `main(text)` that returns an object mapping each word (lowercased, punctuation stripped) to its frequency in a string.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
    [
      { input: ['the cat and the dog'], expected: { the: 2, cat: 1, and: 1, dog: 1 } },
      { input: ['Hello, world! Hello.'], expected: { hello: 2, world: 1 } },
      { input: [''], expected: {} },
    ],
  ),
  T(
    'clamp',
    'Write a function `main(value, min, max)` that returns value clamped to the inclusive [min, max] range.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
    [
      { input: [5, 0, 10], expected: 5 },
      { input: [-3, 0, 10], expected: 0 },
      { input: [15, 0, 10], expected: 10 },
      { input: [0, 0, 0], expected: 0 },
    ],
  ),
  T(
    'csv-sum',
    'Write a function `main(csv)` that parses a CSV string of numbers (comma-separated, one row per line) and returns the sum of all numbers. Ignore blank lines.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
    [
      { input: ['1,2,3\n4,5'], expected: 15 },
      { input: ['10'], expected: 10 },
      { input: ['\n1,1\n'], expected: 2 },
      { input: ['0,0\n0'], expected: 0 },
    ],
  ),
  T(
    'two-sum',
    'Write a function `main(nums, target)` that returns the indices of the two numbers that add up to target. Assume exactly one solution exists and each index used once.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: true },
    [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
    ],
  ),
  T(
    'palindrome',
    'Write a function `main(s)` that returns true if a string is a palindrome ignoring case and non-alphanumeric characters.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
    [
      { input: ['A man, a plan, a canal: Panama'], expected: true },
      { input: ['race a car'], expected: false },
      { input: [''], expected: true },
      { input: ['a'], expected: true },
      { input: ['abba'], expected: true },
    ],
  ),
];