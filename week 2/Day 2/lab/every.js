// every - ALL must pass
const number = [2, 4, 6, 8, 10];
console.log(number.every(n => n % 2 === 0)); // true
console.log(number.every(n => n > 5));      // false