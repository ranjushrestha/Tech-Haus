const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {

  console.log("\n=== CLI Calculator ===");
  console.log("1. Add");
  console.log("2. Subtract");
  console.log("3. Multiply");
  console.log("4. Divide");
  console.log("5. Power");
  console.log("6. Square Root");
  console.log("7. Exit");

  rl.question("\nChoose (1-7): ", (choice) => {

    if (choice === "7") {
      console.log("Calculator closed.");
      rl.close();
      return;
    }

    if (choice === "6") {

      rl.question("Enter number: ", (num) => {

        const result = Math.sqrt(Number(num));

        console.log(`\nResult: ${result}`);

        showMenu();

      });

    } else {

      rl.question("Enter first number: ", (num1) => {

        rl.question("Enter second number: ", (num2) => {

          num1 = Number(num1);
          num2 = Number(num2);

          let result;

          switch (choice) {

            case "1":
              result = num1 + num2;
              break;

            case "2":
              result = num1 - num2;
              break;

            case "3":
              result = num1 * num2;
              break;

            case "4":
              result = num1 / num2;
              break;

            case "5":
              result = num1 ** num2;
              break;

            default:
              console.log("Invalid choice");
              showMenu();
              return;

          }

          console.log(`\nResult: ${result}`);

          showMenu();

        });

      });

    }

  });

}

showMenu();

// PS C:\Users\DELL\Desktop\Tech Haus> cd "week 1"       
// PS C:\Users\DELL\Desktop\Tech Haus\week 1> node calculator.js

// === CLI Calculator ===
// 1. Add
// 2. Subtract
// 3. Multiply
// 4. Divide
// 5. Power
// 6. Square Root
// 7. Exit

// Choose (1-7): 1
// Enter first number: 10
// Enter second number: 5

// Result: 15

// === CLI Calculator ===
// 1. Add
// 2. Subtract
// 3. Multiply
// 4. Divide
// 5. Power
// 6. Square Root
// 7. Exit

// Choose (1-7): 3
// Enter first number: 4
// Enter second number: 6

// Result: 24

// === CLI Calculator ===
// 1. Add
// 2. Subtract
// 3. Multiply
// 4. Divide
// 5. Power
// 6. Square Root
// 7. Exit

// Choose (1-7): Exit
// Enter first number: 7
// Enter second number: i
// Invalid choice

// === CLI Calculator ===
// 1. Add
// 2. Subtract
// 3. Multiply
// 4. Divide
// 5. Power
// 6. Square Root
// 7. Exit

// Choose (1-7): 7
// Calculator closed.
// PS C:\Users\DELL\Desktop\Tech Haus\week 1> 
