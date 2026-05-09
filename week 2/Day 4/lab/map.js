const map = new Map();

map.set("name", "John");
map.set("age", 25);
map.set("city", "NYC");

console.log(map.get("name")); // John
console.log(map.has("age")); // true
console.log(map.size); // 3
map.delete("city");
console.log([...map.keys()]);   // ["name", "age"]
console.log([...map.values()]);  // ["John", 25]
console.log([...map.entries()]); // [["name", "John"], ["age", 25]]

// Iterate
for (const [key, value] of map) {
    console.log(`${key}: ${value}`);
}