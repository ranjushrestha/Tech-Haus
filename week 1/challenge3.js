let text = "JavaScript is awesome!";

console.log(text.length); // 22

console.log(text.toUpperCase()); // JAVASCRIPT IS AWESOME!

console.log(text.toLowerCase()); // javascript is awesome!

console.log(text.includes("is")); // true

console.log(text.startsWith("Java")); // true

console.log(text.endsWith("!")); // true

console.log(text.replace("awesome", "powerful")); // JavaScript is powerful!

console.log(text[0]); // J

console.log(text[text.length - 1]); // !

console.log(text.slice(0, 10)); // JavaScript

console.log(text.split(" ")); // ['JavaScript', 'is', 'awesome!']