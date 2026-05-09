
// ## 🎯 Challenge 3: Date Formatter
// **File:** `challenge3-date.js`


function formatDate(date, format) {
  const newDate = new Date(date);

  if (format === "long") {
    return newDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return date;
}

console.log(formatDate("2024-01-15", "long"));