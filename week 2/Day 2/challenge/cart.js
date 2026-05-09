// ### 🎯 Challenge 2: Shopping Cart
// **File:** `challenge2-cart.js`

// Build cart functions:
// ```javascript
const cart = [
  { item: "Apple", price: 1, quantity: 5 },
  { item: "Bread", price: 3, quantity: 2 },
  { item: "Milk", price: 4, quantity: 1 },
];

// // Functions needed:
// getSubtotal(cart);      // 5*1 + 3*2 + 4*1 = 15
// getTax(cart, 0.1);      // 1.50
// getTotal(cart, 0.1);   // 16.50

const getSubtotal = (cart) => {
  return cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );
};
console.log(getSubtotal(cart)); //15

const getTax = (cart, tax) => {
  const total = getSubtotal(cart);
  return total * tax;
};
console.log(getTax(cart, 0.1)); //1.5

function getTotal(cart, taxRate) {
  const subtotal = getSubtotal(cart);
  const tax = getTax(cart, 0.1);

  return subtotal + tax;
}

console.log(getTotal(cart, 0.1)); //16.5

function findCheapest(cart) {
  let cheapest = cart[0]; // assume first item is the cheapest

  for (let i = 1; i < cart.length; i++) {
    if (cart[i].price < cheapest.price) {
      cheapest = cart[i];
    }
  }
  return `${cheapest.item}: ${cheapest.price}`;
}

console.log(findCheapest(cart)); // Apple: 1

function findMostExpensive(cart) {
  let highest = cart[0]; // assume first item is the most expensive

  for (let i = 1; i < cart.length; i++) {
    if (cart[i].price > highest.price) {
      highest = cart[i];
    }
  }
  return `${highest.item}: ${highest.price}`;
}

console.log(findMostExpensive(cart)); //Milk: 4

const getItemCount = (cart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};
console.log(getItemCount(cart)); // 8
