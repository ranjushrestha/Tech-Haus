 class Book {
    constructor(title, author, year) {
        // Properties
        this.title = title;
        this.author = author;
        this.year = year;
    }

    getInfo() {
        // Return title by author (year)
        return `${this.title} by ${this.author} (${this.year})`;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(book) {
         // Add to collection
        this.books[this.books.length] = book;
    }

    removeBook(title) {
        // Remove by title
        const result = [];

        for (let i = 0; i < this.books.length; i++) {
            if (this.books[i].title !== title) {
                result[result.length] = this.books[i];
            }
        }

        this.books = result;
        console.log("removed")
    }

    findByAuthor(author) {
         // Find all books by author
        const result = [];

        for (let i = 0; i < this.books.length; i++) {
            if (this.books[i].author === author) {
                result[result.length] = this.books[i];
            }
        }

        return result;
    }

    findByYear(year) {
         // Find books from year
        const result = [];

        for (let i = 0; i < this.books.length; i++) {
            if (this.books[i].year === year) {
                result[result.length] = this.books[i];
            }
        }

        return result;
    }

    getBookCount() {
         // Return count
        return this.books.length;
    }
}const library = new Library();

const book1 = new Book("Atomic Habits", "Orwell", 2018);
const book2 = new Book("Deep Work", "Cal Newport", 2016);
const book3 = new Book("Digital Minimalism", "Cal Newport", 2019);

library.addBook(book1);
library.addBook(book2);
library.addBook(book3);

console.log(book1.getInfo()); //Atomic Habits by Orwell (2018)
console.log(library.getBookCount()); //3
console.log(library.findByAuthor("Orwell")); //Book {title: 'Atomic Habits', author: 'Orwell', year: 2018}


console.log(library.findByYear(2019)); //Book {title: 'Digital Minimalism', author: 'Cal Newport', year: 2019}

library.removeBook("Atomic Habits"); //removed

console.log(library.getBookCount()); //2
