const set = new Set([1, 2, 3, 3, 4]);
console.log([...set]); // [1, 2, 3, 4]

set.add(5);
set.delete(1);
set.has(2); // true
set.size;    // 4

// Unique values
const numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
console.log([...new Set(numbers)]); // [1, 2, 3, 4]