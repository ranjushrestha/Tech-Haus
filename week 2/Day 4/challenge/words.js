function countWords(text) {

    // Return Map of word counts
    const words = text.toLowerCase().split(" ");

    const wordMap = new Map();

    for (const word of words) {

        if (wordMap.has(word)) {
            wordMap.set(word, wordMap.get(word) + 1);
        } else {
            wordMap.set(word, 1);
        }

    }

    return wordMap;
}

const text = "the quick brown fox jumps over the lazy dog the quick";

console.log(countWords(text));

/*
Map(8) {
  'the' => 3,
  'quick' => 2,
  'brown' => 1,
  'fox' => 1,
  'jumps' => 1,
  'over' => 1,
  'lazy' => 1,
  'dog' => 1
}
*/