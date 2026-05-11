// ### 🎯 Challenge 1: Student Grade Processor
// **File:** `challenge1-students.js`

const students = [
  { name: "Alice", scores: [85, 90, 92] },
  { name: "Bob", scores: [70, 75, 72] },
  { name: "Charlie", scores: [95, 98, 100] },
];

function getStudentStats(students) {
  return students.map((student) => {
    // - average: average score
    const total = student.scores.reduce((sum, score) => sum + score, 0);
    const average = total / student.scores.length;
    // - highest: highest score
    const highest = Math.max(...student.scores);
    // - lowest: lowest score
    const lowest = Math.min(...student.scores);
    // - passed: average >= 70
    const passed = average >= 70;

    return {
      name: student.name,
      average,
      highest,
      lowest,
      passed,
    };
  });
}

console.log(getStudentStats(students));
//{name: 'Alice', average: 89, highest: 92, lowest: 85, passed: true}
//{name: 'Bob', average: 72.33333333333333, highest: 75, lowest: 70, passed: true}
//{name: 'Charlie', average: 97.66666666666667, highest: 100, lowest: 95, passed: true}

const studentsGradeData = [
    { name: "Alice", scores: [85, 90, 92] },
    { name: "Bob", scores: [70, 75, 72] },
    { name: "Charlie", scores: [95, 98, 100] },
    { name: "David", scores: [50, 60, 55] }
];

function getAverage(scores) {
    let total = scores.reduce((sum,s) => sum + s,0)
    return total / scores.length;
}

function getHonorRoll(studentsGradeData) {
    const result = [];

    for (let i = 0; i < studentsGradeData.length; i++) {
        const average = getAverage(studentsGradeData[i].scores);

        if (average >= 90) {
            // result[result.length] = {
            //     ...studentsGradeData[i],
            //     average: Number(average.toFixed(2))
            // };
            result.push({...studentsGradeData[i], average: Number(average.toFixed(2) )
            });
        }
    }

    return result;
}

function getPassing(studentsGradeData) {
    const result = [];

    for (let i = 0; i < studentsGradeData.length; i++) {
        const average = getAverage(studentsGradeData[i].scores);

        if (average >= 70) {
            // result[result.length] = {
            //     ...studentsGradeData[i],
            //     average: Number(average.toFixed(2))
            // };
            result.push({...studentsGradeData[i], average: Number(average.toFixed(2) )
            });
        }
    }

    return result;
}

function getFailing(studentsGradeData) {
    const result = [];

    for (let i = 0; i < studentsGradeData.length; i++) {
        const average = getAverage(studentsGradeData[i].scores);

        if (average < 70) {
            // result[result.length] = {
            //     ...studentsGradeData[i],
                // average: Number(average.toFixed(2))
                result.push({...studentsGradeData[i], average: Number(average.toFixed(2) )
            });
        }
    }

    return result;
}



console.log(getHonorRoll(studentsGradeData));
//{name: 'Charlie', scores: Array(3), average: 97.67}
console.log(getPassing(studentsGradeData));
// {name: 'Alice', scores: Array(3), average: 89}
// {name: 'Bob', scores: Array(3), average: 72.33}
// {name: 'Charlie', scores: Array(3), average: 97.67}
console.log(getFailing(studentsGradeData));
//{name: 'David', scores: Array(3), average: 55}