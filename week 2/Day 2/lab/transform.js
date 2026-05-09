// ### 🎯 Lab 1: Array Transformations
// **File:** `lab1-transform.js`


const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map - transform each item
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2,4,6,8,10,12,14,16,18,20]

// filter - keep items that pass test
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2,4,6,8,10]

// reduce - combine all into one value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 55

// Chaining!
const sumOfSquares = numbers
    .filter(n => n > 3)
    .map(n => n * n)
    .reduce((acc, n) => acc + n, 0);
console.log(sumOfSquares); // (4²+5²+6²+7²+8²+9²+10²) = 335