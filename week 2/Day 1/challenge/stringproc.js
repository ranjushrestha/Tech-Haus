function analyze(text) {
  // - wordCount: number of words
  const wordCount = text.trim().split(/\s+/).length;

  // - charCount: characters (no spaces)
  const charCount = text.replace(/\s/g, "").length;

  // - uniqueChars: unique characters
  const uniqueChars = [...new Set(text)];
  // - reverse: reversed string
  const reverse = text.split("").reverse().join("");

  // - isPalindrome: true/false
  const isPalindrome = reverse === text;

  return {
    wordCount,
    charCount,
    uniqueChars,
    isPalindrome,
    reverse,
  };
}

console.log(analyze("hello world"));

// Object
// charCount
// :
// 10
// isPalindrome
// :
// false
// reverse
// :
// "dlrow olleh"
// uniqueChars
// :
// (8) ['h', 'e', 'l', 'o', ' ', 'w', 'r', 'd']
// wordCount
// :
// 2
console.log(analyze("racecar"));

// charCount
// : 
// 7
// isPalindrome
// : 
// true
// reverse
// : 
// "racecar"
// uniqueChars
// : 
// Array(4)
// 0
// : 
// "r"
// 1
// : 
// "a"
// 2
// : 
// "c"
// 3
// : 
// "e"
// length
// : 
// 4
// [[Prototype]]
// : 
// Array(0)
// wordCount
// : 
1