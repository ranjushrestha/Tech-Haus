
function myMap(arr, fn) {
    const result = [];

    for (let i = 0; i < arr.length; i++) { 
        result[result.length] = fn(arr[i], i, arr);
        //result.push(fn(arr[i], i, arr))
    }

    return result;
}

// myFilter
function myFilter(arr, fn) {
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        if (fn(arr[i], i, arr)) {
            result[result.length] = arr[i];
            //result.push(arr[i])
        }
    }

    return result;
}

// myReduce
function myReduce(arr, fn, initial) {
    let accumulator;
    let startIndex;

    if (initial !== undefined) {// if initial not given take first index 
        accumulator = initial;
        startIndex = 0;
    } else {
        accumulator = arr[0]; 
        startIndex = 1;
    }

    for (let i = startIndex; i < arr.length; i++) {
        accumulator = fn(accumulator, arr[i], i, arr);
    }

    return accumulator;
}

// myFind
function myFind(arr, fn) {
    for (let i = 0; i < arr.length; i++) { 
        if (fn(arr[i], i, arr)) {// if condition is true return first item
            return arr[i];
        }
    }

    return undefined;
}

// myIncludes
function myIncludes(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === value) { // if search item matches return true
            return true;
        }
    }

    return false;
}


// Testing
const test = [1, 2, 3];

// myMap
console.assert(
    JSON.stringify(myMap(test, x => x * 2)) ===
    JSON.stringify(test.map(x => x * 2))
);

// myFilter
console.assert(
    JSON.stringify(myFilter(test, x => x > 1)) ===
    JSON.stringify(test.filter(x => x > 1))
);

// myReduce
console.assert(
    myReduce(test, (acc, curr) => acc + curr, 0) ===
    test.reduce((acc, curr) => acc + curr, 0)
);

// myFind
console.assert(
    myFind(test, x => x === 2) ===
    test.find(x => x === 2)
);

// myIncludes
console.assert(
    myIncludes(test, 3) ===
    test.includes(3)
);

console.log("All tests passed!");