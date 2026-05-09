 function operate(a, b, callback) {
    return callback(a, b);
}

// Create operations
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const power = (a, b) => Math.pow(a, b);

// Use them
console.log(operate(5, 3, add));       // 8
console.log(operate(5, 3, multiply)); // 15
console.log(operate(2, 8, power));   // 256

// Another eg of HOF
function greet(name, callback) {
    console.log(`Hello ${name}`)
    callback()
}
function goodBye() {
    console.log("Good Bye")
}

console.log(greet("Ranju", goodBye))