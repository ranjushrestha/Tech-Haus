//  Challenge 1: Array Processor


const numbers = [5, 10, 15, 20, 25];

const sum = (numbers) => {
    return numbers.reduce((a, sum) => a +=sum,0)
}

const average = (numbers) => {
const total = numbers.reduce((a, sum) => a +=sum,0)
return total / numbers.length
}

const min = (numbers) => {
    return Math.min(...numbers)
}
const max = (numbers) => {
    return Math.max(...numbers)
}

const range = (numbers) => {
const max = Math.max(...numbers)
const min = Math.min(...numbers)
return max - min
}

console.log(sum(numbers));      // 75
console.log(average(numbers)); // 15
console.log(min(numbers));   // 5
console.log(max(numbers));  // 25
console.log(range(numbers)); // 20