const user = {
    name: "John",
    age: 25,
    address: {
        city: "NYC",
        zip: "10001"
    }
};
const { name, age } = user;
console.log(name, age); // John 25

// Nested destructuring
const { address: { city, zip } } = user;
console.log(city, zip); // NYC 10001

// Default values
const { country = "USA" } = user;
console.log(country); // USA

// Rename
const { name: fullName } = user;
console.log(fullName); // John