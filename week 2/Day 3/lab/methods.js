const a = { x: 1 };
const b = { y: 2 };

const merged = Object.assign({}, a, b);
console.log(merged); // { x: 1, y: 2 }

// Spread operator (preferred!)
const combined = { ...a, ...b, z: 3 };
console.log(combined); // { x: 1, y: 2, z: 3 }

// Shallow copy
const original = { x: 1, nested: { y: 2 } };
const copy = { ...original };
copy.nested.y = 99;
console.log(original.nested.y); // 99 (same reference!)

// Deep copy
const deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.nested.y = 99;
console.log(original.nested.y); // 2 (unchanged!)