for (let i = 1; i <= 30; i++) {

  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz"); // Multiples of both 3 and 5
  } 
  else if (i % 3 === 0) {
    console.log("Fizz"); // Multiples of 3
  } 
  else if (i % 5 === 0) {
    console.log("Buzz"); // Multiples of 5
  } 
  else {
    console.log(i); // Normal numbers
  }

}

// 1
// fizzbuzz.js:13 2
// fizzbuzz.js:7 Fizz
// fizzbuzz.js:13 4
// fizzbuzz.js:10 Buzz
// fizzbuzz.js:7 Fizz
// fizzbuzz.js:13 7
// fizzbuzz.js:13 8
// fizzbuzz.js:7 Fizz
// fizzbuzz.js:10 Buzz
// fizzbuzz.js:13 11
// fizzbuzz.js:7 Fizz
// fizzbuzz.js:13 13
// fizzbuzz.js:13 14
// fizzbuzz.js:4 FizzBuzz
// fizzbuzz.js:13 16
// fizzbuzz.js:13 17
// fizzbuzz.js:7 Fizz
// fizzbuzz.js:13 19
// fizzbuzz.js:10 Buzz
// fizzbuzz.js:7 Fizz
// fizzbuzz.js:13 22
// fizzbuzz.js:13 23
// fizzbuzz.js:7 Fizz
// fizzbuzz.js:10 Buzz
// fizzbuzz.js:13 26
// fizzbuzz.js:7 Fizz
// fizzbuzz.js:13 28
// fizzbuzz.js:13 29
// fizzbuzz.js:4 FizzBuzz