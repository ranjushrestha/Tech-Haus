class BankAccount {
  constructor(owner, initialBalance = 0) {
    this.owner = owner;
    this.balance = initialBalance;
    this.transactions = [];
  }

  deposit(amount) {
    this.balance += amount;

    this.transactions.push({
      type: "deposit",
      amount: amount,
      balance: this.balance
    });

    return this.balance;
  }

  withdraw(amount) {
    if (amount > this.balance) {
      return "Insufficient funds";
    }

    this.balance -= amount;

    this.transactions.push({
      type: "withdraw",
      amount: amount,
      balance: this.balance
    });

    return this.balance;
  }

  getBalance() {
    return this.balance;
  }

  getTransactionHistory() {
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