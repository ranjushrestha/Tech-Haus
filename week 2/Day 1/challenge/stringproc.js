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

/*
{
  wordCount: 2,
  charCount: 10,
  uniqueChars: ['h', 'e', 'l', 'o', ' ', 'w', 'r', 'd'],
  isPalindrome: false,
  reverse: 'dlrow olleh'
}
*/

console.log(analyze("racecar"));

/*
{
  wordCount: 1,
  charCount: 7,
  uniqueChars: ['r', 'a', 'c', 'e'],
  isPalindrome: true,
  reverse: 'racecar'
}
*/