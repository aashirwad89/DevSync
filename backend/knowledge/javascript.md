# JavaScript - Complete Guide for DevSync

## Table of Contents
1. [ES6+ Fundamentals](#fundamentals)
2. [Async Programming](#async)
3. [Modules](#modules)
4. [Functions & Arrow Functions](#functions)
5. [Objects & Classes](#classes)
6. [Array Methods](#arrays)
7. [String Methods](#strings)
8. [Error Handling](#errors)
9. [Closures & Scope](#scope)
10. [Best Practices](#practices)
11. [Performance Tips](#performance)

## ES6+ Fundamentals {#fundamentals}

### Variables & Declarations

```javascript
// var (avoid) - function scoped
var x = 1;

// let - block scoped, reassignable
let y = 2;
y = 3; // OK

// const - block scoped, immutable reference
const z = 3;
z = 4; // Error: Assignment to constant variable

// const with objects (reference immutable, content mutable)
const obj = { name: 'John' };
obj.name = 'Jane'; // OK - changing property
obj = {}; // Error - reassigning
```

### Template Literals

```javascript
// String interpolation
const name = 'Alice';
const greeting = `Hello, ${name}!`;

// Multi-line strings
const message = `
  This is a
  multi-line string
`;

// Tagged template literals
function highlight(strings, ...values) {
  return strings[0] + `<mark>${values[0]}</mark>` + strings[1];
}
const result = highlight`The answer is ${42}!`;
// Result: "The answer is <mark>42</mark>!"
```

### Destructuring

```javascript
// Array destructuring
const [a, b, c] = [1, 2, 3];
const [first, ...rest] = [1, 2, 3, 4];

// Object destructuring
const { name, age } = { name: 'John', age: 30 };
const { name: fullName } = { name: 'John' }; // Rename

// Nested destructuring
const { user: { name, email } } = { user: { name: 'John', email: 'john@example.com' } };

// Function parameter destructuring
function greet({ name, age }) {
  console.log(`Hello ${name}, age ${age}`);
}
greet({ name: 'John', age: 30 });
```

### Spread & Rest Operators

```javascript
// Spread operator (arrays)
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Spread operator (objects)
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Rest operator (function parameters)
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10
```

## Async Programming {#async}

### Promises

```javascript
// Promise creation
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

// Promise chaining
promise
  .then(result => {
    console.log(result);
    return result + ' More data';
  })
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'));

// Promise.all (wait for all)
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results))
  .catch(error => console.error(error));

// Promise.race (wait for first)
Promise.race([promise1, promise2])
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Promise.allSettled (wait for all, don't fail)
Promise.allSettled([promise1, promise2])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log(result.value);
      } else {
        console.error(result.reason);
      }
    });
  });
```

### Async/Await

```javascript
// Basic async/await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    console.log('Fetch completed');
  }
}

// Sequential execution
async function process() {
  const user = await fetchUser(1);
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  return { user, posts, comments };
}

// Parallel execution (faster)
async function processParallel() {
  const user = await fetchUser(1);
  const [posts, friends] = await Promise.all([
    fetchPosts(user.id),
    fetchFriends(user.id)
  ]);
  return { user, posts, friends };
}

// Error handling with multiple awaits
async function robustFetch() {
  try {
    const [data1, data2] = await Promise.all([
      fetch1(),
      fetch2()
    ]);
    return { data1, data2 };
  } catch (error) {
    console.error('One or more requests failed:', error);
    throw error;
  }
}
```

## Modules {#modules}

### ES6 Modules

**Exporting**
```javascript
// Named exports
export const API_URL = 'https://api.example.com';
export function fetchData() { }
export class User { }

// Default export
export default function logMessage() { }

// Export with alias
export { function1 as fn1, function2 as fn2 };
```

**Importing**
```javascript
// Named imports
import { API_URL, fetchData } from './utils.js';

// Default import
import logMessage from './logger.js';

// Combine named and default
import logMessage, { API_URL, fetchData } from './utils.js';

// Import with alias
import { fetchData as getData } from './utils.js';

// Import all as namespace
import * as utils from './utils.js';
utils.fetchData();
utils.API_URL;

// Dynamic import
const module = await import('./utils.js');
```

### CommonJS (Node.js)

```javascript
// Exporting
module.exports = function myFunction() { };
module.exports = { func1, func2 };
exports.func1 = func1; // Shorthand

// Importing
const myModule = require('./myModule.js');
const { func1, func2 } = require('./myModule.js');
```

## Functions & Arrow Functions {#functions}

### Regular Functions

```javascript
// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// Function expression
const greet = function(name) {
  return `Hello, ${name}!`;
};

// Immediately Invoked Function Expression (IIFE)
(function() {
  console.log('Runs immediately');
})();

// Higher-order functions
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}
const double = createMultiplier(2);
double(5); // 10
```

### Arrow Functions

```javascript
// Basic arrow function
const add = (a, b) => a + b;

// Single parameter (parentheses optional)
const square = x => x * x;

// Multiple statements (need braces and return)
const calculate = (a, b) => {
  const sum = a + b;
  return sum * 2;
};

// Returning objects (wrap in parentheses)
const createUser = (name, age) => ({ name, age });

// With default parameters
const greet = (name = 'Guest') => `Hello, ${name}!`;

// Arrow functions and 'this'
function Person(name) {
  this.name = name;
  // Arrow function inherits 'this' from outer scope
  this.getName = () => this.name;
  // Regular function has own 'this'
  this.getNameFunc = function() { return this.name; };
}
```

## Objects & Classes {#classes}

### Objects

```javascript
// Object literal
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  greet() {
    return `Hello, ${this.name}!`;
  },
  'user-id': 123  // Property with special characters
};

// Accessing properties
user.name;         // John
user['email'];     // john@example.com
user['user-id'];   // 123

// Object methods
Object.keys(user);        // ['name', 'age', 'email', 'greet', 'user-id']
Object.values(user);      // ['John', 30, 'john@example.com', ...]
Object.entries(user);     // [['name', 'John'], ['age', 30], ...]
Object.assign({}, user);  // Clone object

// Property descriptors
Object.defineProperty(user, 'id', {
  value: 1,
  writable: false,
  enumerable: true,
  configurable: false
});

// Getters and setters
const user = {
  _age: 0,
  get age() { return this._age; },
  set age(value) { this._age = Math.max(0, value); }
};
```

### Classes

```javascript
// Class definition
class User {
  // Constructor
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // Instance method
  greet() {
    return `Hello, ${this.name}!`;
  }

  // Static method
  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Getter
  get info() {
    return `${this.name} (${this.email})`;
  }

  // Setter
  set email(value) {
    if (User.isValidEmail(value)) {
      this._email = value;
    } else {
      throw new Error('Invalid email');
    }
  }
}

// Inheritance
class Admin extends User {
  constructor(name, email, role) {
    super(name, email);
    this.role = role;
  }

  // Override method
  greet() {
    return super.greet() + ` I'm an ${this.role}`;
  }
}

// Usage
const user = new User('John', 'john@example.com');
const admin = new Admin('Jane', 'jane@example.com', 'Admin');
```

## Array Methods {#arrays}

### Common Array Methods

```javascript
const arr = [1, 2, 3, 4, 5];

// map - transform elements
const doubled = arr.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter - select elements
const evens = arr.filter(x => x % 2 === 0); // [2, 4]

// reduce - aggregate values
const sum = arr.reduce((acc, x) => acc + x, 0); // 15
const grouped = arr.reduce((acc, x) => {
  acc[x % 2 === 0 ? 'even' : 'odd'].push(x);
  return acc;
}, { even: [], odd: [] });

// find - get first matching element
const first = arr.find(x => x > 3); // 4

// findIndex - get first matching index
const idx = arr.findIndex(x => x > 3); // 3

// some - check if any element matches
const hasEven = arr.some(x => x % 2 === 0); // true

// every - check if all elements match
const allPositive = arr.every(x => x > 0); // true

// includes - check if contains value
const has3 = arr.includes(3); // true

// forEach - iterate without return
arr.forEach((x, idx) => console.log(`Index ${idx}: ${x}`));

// sort - sort elements (mutates original)
const sorted = arr.sort((a, b) => a - b);
const desc = [...arr].sort((a, b) => b - a); // Don't mutate original

// flat - flatten nested arrays
const nested = [[1, 2], [3, 4]];
const flat = nested.flat(); // [1, 2, 3, 4]

// flatMap - map then flatten
const result = arr.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6, ...]

// concat - combine arrays
const combined = arr.concat([6, 7]); // [1, 2, 3, 4, 5, 6, 7]

// slice - extract portion (doesn't mutate)
const portion = arr.slice(1, 4); // [2, 3, 4]

// splice - modify array (mutates)
arr.splice(2, 1); // Remove element at index 2
```

## String Methods {#strings}

### Common String Methods

```javascript
const str = '  Hello, World!  ';

// Case conversion
str.toUpperCase();      // '  HELLO, WORLD!  '
str.toLowerCase();      // '  hello, world!  '

// Trimming
str.trim();             // 'Hello, World!'
str.trimStart();        // 'Hello, World!  '
str.trimEnd();          // '  Hello, World!'

// Search
str.includes('World');  // true
str.indexOf('World');   // 9
str.startsWith('Hello'); // false (leading spaces)
str.endsWith('!');      // true

// Extract
str.charAt(1);          // ' '
str.charCodeAt(1);      // 32
str.substring(2, 7);    // 'Hello'
str.slice(2, 7);        // 'Hello'
str.slice(-1);          // '!'

// Replace
str.replace('World', 'JavaScript');      // '  Hello, JavaScript!  '
str.replaceAll('l', 'L');                // '  HeLLo, WorLd!  '

// Split
str.split(',');         // ['  Hello', ' World!  ']
str.split('');          // Array of characters

// Repeat & Pad
'abc'.repeat(3);        // 'abcabcabc'
'5'.padStart(3, '0');   // '005'
'5'.padEnd(3, '0');     // '500'

// Regular expressions
const pattern = /hello/i;
pattern.test(str);      // true
str.match(/\w+/g);      // ['Hello', 'World']
```

## Error Handling {#errors}

### Try-Catch-Finally

```javascript
try {
  // Code that might throw
  riskyOperation();
} catch (error) {
  // Handle error
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
} finally {
  // Always runs
  cleanup();
}

// Error object properties
try {
  throw new Error('Custom error');
} catch (error) {
  console.log(error.name);     // 'Error'
  console.log(error.message);  // 'Custom error'
  console.log(error.stack);    // Stack trace
}

// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

try {
  if (!email) {
    throw new ValidationError('Email is required');
  }
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Closures & Scope {#scope}

### Understanding Closures

```javascript
// Basic closure
function outer(x) {
  return function inner(y) {
    return x + y;  // inner function has access to x
  };
}
const add5 = outer(5);
add5(3);  // 8

// Closure with mutable state
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2

// Closure in loop
const functions = [];
for (let i = 0; i < 3; i++) {
  functions.push(() => i);  // Captures i (with let, correct behavior)
}
functions[0](); // 0
functions[1](); // 1

// Variable scope
let globalVar = 'global';

function scopeExample() {
  let localVar = 'local';
  const blockVar = 'block';
  
  if (true) {
    const innerVar = 'inner';
    console.log(globalVar, localVar, blockVar, innerVar); // All accessible
  }
  
  // console.log(innerVar); // Error: Not in scope
}
```

## Best Practices {#practices}

### Code Quality

```javascript
// 1. Use const by default, let if needed, avoid var
const user = { name: 'John' };
let counter = 0;

// 2. Prefer pure functions
// Bad
let total = 0;
function addBad(num) {
  total += num;
  return total;
}

// Good
function addGood(a, b) {
  return a + b;
}

// 3. Use meaningful names
// Bad
const x = 5;
const calc = (a, b) => a + b;

// Good
const userAge = 5;
const sum = (a, b) => a + b;

// 4. Handle errors appropriately
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// 5. Validate inputs
function processData(data) {
  if (!data) {
    throw new Error('Data is required');
  }
  if (typeof data !== 'object') {
    throw new TypeError('Data must be an object');
  }
  return data;
}
```

## Performance Tips {#performance}

### Optimization Techniques

```javascript
// 1. Memoization
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
const memoizedFib = memoize(fibonacci);

// 2. Lazy loading
function lazyLoad() {
  let expensive = null;
  return function() {
    if (expensive === null) {
      expensive = doExpensiveComputation();
    }
    return expensive;
  };
}

// 3. Debouncing (wait for events to stop)
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// 4. Throttling (execute at most once per interval)
function throttle(fn, interval) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      fn(...args);
      lastTime = now;
    }
  };
}

// 5. Batch operations
// Bad: Multiple DOM updates
for (let i = 0; i < 1000; i++) {
  document.body.innerHTML += `<div>${i}</div>`;
}

// Good: Batch updates
let html = '';
for (let i = 0; i < 1000; i++) {
  html += `<div>${i}</div>`;
}
document.body.innerHTML = html;

// 6. Use appropriate data structures
// Bad: O(n) search
const users = [{ id: 1 }, { id: 2 }, ...];
const user = users.find(u => u.id === targetId);

// Good: O(1) lookup
const userMap = new Map(users.map(u => [u.id, u]));
const user = userMap.get(targetId);
```

---

**Learn More**: https://developer.mozilla.org/en-US/docs/Web/JavaScript