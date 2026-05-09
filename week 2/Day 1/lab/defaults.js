function createUser(name, age = 18, city = "Unknown") {
    return { name, age, city };
}

// Test calling with:
console.log(createUser("John"));         // John, 18, Unknown
console.log(createUser("Jane", 25));   // Jane, 25, Unknown
console.log(createUser("Bob", 30, "NYC")); // Bob, 30,


function calculate(a, b = 1, operation = "add") {
  return operation === "add"
    ? a + b
    : operation === 'subtract'
      ? a - b
      : operation === 'multiply'
        ? a * b
        : a / b;

}

console.log(calculate(5));          // 6 (5 + 1)
console.log(calculate(5, 3));       // 8 (5 + 3)
console.log(calculate(5, 3, "multiply")); // 15