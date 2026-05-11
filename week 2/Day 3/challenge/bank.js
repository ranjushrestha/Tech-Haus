class BankAccount {
  constructor(owner, initialBalance = 0) {
    this.owner = owner;
    this.balance = initialBalance;
    this.transactions = [];
  }

  deposit(amount) {
    // Add to balance, 
   this.balance += amount;

   //log transaction
    this.transactions.push({
      type: "deposit",
      amount: amount,
      balance: this.balance
    });

     // Return new balance
    return this.balance;
  }

  withdraw(amount) {
    // Check sufficient funds
    if (amount > this.balance) {
      return "Insufficient funds";
    }

     // Subtract
    this.balance -= amount;

    // log transaction
    this.transactions.push({
      type: "withdraw",
      amount: amount,
      balance: this.balance
    });
     
    // Return new balance or error
    return this.balance;
  }

  getBalance() {
    // Return current balance
    return this.balance;
  }

  getTransactionHistory() {
    // Return all transactions
    return this.transactions;
  }
}

const account = new BankAccount("John", 1000);

console.log(account.deposit(500)); // 1500
console.log(account.withdraw(200)); // 1300
console.log(account.getBalance()); // 1300
console.log(account.getTransactionHistory());
// {type: 'deposit', amount: 500, balance: 1500}
// {type: 'withdraw', amount: 200, balance: 1300}