// ### 🎯 Lab 3: Find & Index
// **File:** `lab3-find.js`


const people = [
    { name: "John", age: 25 },
    { name: "Jane", age: 30 },
    { name: "Bob", age: 25 }
];

// find - first match
console.log(people.find(p => p.age === 25)); // { name: "John", age: 25 }

// findIndex - position of first match
console.log(people.findIndex(p => p.name === "Jane")); // 1

// findLast (newer JS)
const lastEven = [1, 2, 3, 4, 5].findLast(n => n % 2 === 0);
console.log(lastEven); // 4