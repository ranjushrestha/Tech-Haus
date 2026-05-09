class Product {
    constructor(name, price, quantity) {
        this.id = Date.now() + Math.random();
        this.name = name;
        this.price = price;
        this.quantity = quantity;

        // Add id, createdAt
        this.createdAt = new Date();
    }
}

class Inventory {
    constructor() {
        this.products = [];
    }
    
    addProduct(product) {
        // Add with unique ID
        this.products.push(product);
        return product;
    }
    
    updateQuantity(id, quantity) {
        // Update quantity
        const product = this.getProduct(id);

        if (!product) return "Product not found";

        product.quantity = quantity;

        return product;
    }
    
    getProduct(id) {
        // Find by ID
        return this.products.find(product => product.id === id);
    }
    
    getLowStock(threshold = 10) {
        // Products with qty < threshold
        return this.products.filter(product => product.quantity < threshold);
    }
    
    getTotalValue() {
        // Sum of all (price * quantity)
        return this.products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    }
    
    removeOutOfStock() {
        // Remove products with qty = 0
        this.products = this.products.filter(product => product.quantity !== 0);

        return this.products;
    }
}


// console
const inventory = new Inventory();

const laptop = new Product("Laptop", 800, 5);
const mouse = new Product("Mouse", 20, 15);
const keyboard = new Product("Keyboard", 50, 0);

console.log(inventory.addProduct(laptop));

console.log(inventory.addProduct(mouse));

console.log(inventory.addProduct(keyboard));

console.log(inventory.products);

console.log(inventory.getProduct(laptop.id));

console.log(inventory.updateQuantity(laptop.id, 8));

console.log(inventory.getLowStock());

console.log(inventory.getTotalValue());

console.log(inventory.removeOutOfStock());

// Product {id: 1778339699937.815, name: 'Laptop', price: 800, quantity: 5, createdAt: Sat May 09 2026 20:59:59 GMT+0545 (Nepal Time)}
// inventory.js:70 Product {id: 1778339699938.9019, name: 'Mouse', price: 20, quantity: 15, createdAt: Sat May 09 2026 20:59:59 GMT+0545 (Nepal Time)}
// inventory.js:72 Product {id: 1778339699938.073, name: 'Keyboard', price: 50, quantity: 0, createdAt: Sat May 09 2026 20:59:59 GMT+0545 (Nepal Time)}
// inventory.js:74 (3) [Product, Product, Product]
// inventory.js:76 Product {id: 1778339699937.815, name: 'Laptop', price: 800, quantity: 5, createdAt: Sat May 09 2026 20:59:59 GMT+0545 (Nepal Time)}createdAt: Sat May 09 2026 20:59:59 GMT+0545 (Nepal Time) {}id: 1778339699937.815name: "Laptop"price: 800quantity: 8[[Prototype]]: Object
// inventory.js:78 Product {id: 1778339699937.815, name: 'Laptop', price: 800, quantity: 8, createdAt: Sat May 09 2026 20:59:59 GMT+0545 (Nepal Time)}
// inventory.js:80 (2) [Product, Product]
// inventory.js:82 6700
// inventory.js:84 