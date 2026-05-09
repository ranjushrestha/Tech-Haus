// ### 🎯 Daily Challenge: Temperature Converter

// Formula:
// F = (C * 9/5) + 32
// C = (F - 32) * 5/9


// 1. Convert 0°C to Fahrenheit

const celsius1 = 0;

const fahrenheit1 = (celsius1 * 9/5) + 32;

console.log(`${celsius1}°C = ${fahrenheit1}°F`); //0°C = 32°F


// 2. Convert 100°C to Fahrenheit

const celsius2 = 100;

const fahrenheit2 = (celsius2 * 9/5) + 32;

console.log(`${celsius2}°C = ${fahrenheit2}°F`); //100°C = 212°F


// 3. Convert 32°F to Celsius

const fahrenheit3 = 32;

const celsius3 = (fahrenheit3 - 32) * 5/9;

console.log(`${fahrenheit3}°F = ${celsius3}°C`);//32°F = 0°C


// 4. Convert 212°F to Celsius

const fahrenheit4 = 212;

const celsius4 = (fahrenheit4 - 32) * 5/9;

console.log(`${fahrenheit4}°F = ${celsius4}°C`);//212°F = 100°C


// 5. Convert 25°C to Fahrenheit

const celsius5 = 25;

const fahrenheit5 = (celsius5 * 9/5) + 32;

console.log(`${celsius5}°C = ${fahrenheit5}°F`);//25°C = 77°F


// 6. Convert 98.6°F to Celsius

const fahrenheit6 = 98.6;

const celsius6 = (fahrenheit6 - 32) * 5/9;

console.log(`${fahrenheit6}°F = ${celsius6.toFixed(1)}°C`);//98.6°F = 37.0°C


// 7. Convert -40°C to Fahrenheit

const celsius7 = -40;

const fahrenheit7 = (celsius7 * 9/5) + 32;

console.log(`${celsius7}°C = ${fahrenheit7}°F`);//-40°C = -40°F


// 8. Convert 0K to Fahrenheit

const kelvin = 0;

// Kelvin → Celsius
const celsius8 = kelvin - 273.15;

// Celsius → Fahrenheit
const fahrenheit8 = (celsius8 * 9/5) + 32;

console.log(`${kelvin}K = ${fahrenheit8.toFixed(2)}°F`);//0K = -459.67°F