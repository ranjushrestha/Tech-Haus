function countWords(text) {

    // Return Map of word counts
    const words = text.toLowerCase().split(" "); // 
  // store count
    const wordMap = new Map();

    for (const word of words) {

        if (wordMap.has(word)) { //if wordMap has word get the prev count then add 1 to it
            wordMap.set(word, wordMap.get(word) + 1);
        } else {// if wordMap doesnt have word c=set count to 1
            wordMap.set(word, 1);
        }

    }

    return wordMap;
}

const text = "the quick brown fox jumps over the lazy dog the quick";

console.log(countWords(text));

// 0
// : 
// {"the" => 3}
// 1
// : 
// {"quick" => 2}
// 2
// : 
// {"brown" => 1}
// 3
// : 
// {"fox" => 1}
// 4
// : 
// {"jumps" => 1}
// 5
// : 
// {"over" => 1}
// 6
// : 
// {"lazy" => 1}
// 7
// : 
// {"dog" => 1}
// size
// : 
// 8