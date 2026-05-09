// function declaration
function mul(a, b) {
  return a * b;
}

//function expression
const sum = (a, b) => {
  return a + b;
};

// arrow functions
const sub = (a, b) => a - b;
const square = (x) => x * x;
const hello = (name) => `Goodmorning ${name}`;

console.log(mul(5, 3)); //15
console.log(sum(4, 6)); //10
console.log(sub(20, 4)); //16
console.log(square(100)); // 1000
console.log(hello("Ranju")); //Goodmorning Ranju