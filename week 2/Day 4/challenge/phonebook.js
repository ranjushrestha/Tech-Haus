class Phonebook {
    constructor() {
        this.contacts = new Map();
    }
    
    add(name, phone, email) {
        // Add contact
        this.contacts.set(name, {
            phone,
            email
        });

        return `${name} added successfully`;
    }
    
    remove(name) {
        // Remove by name
        if (!this.contacts.has(name)) {
            return "Contact not found";
        }

        this.contacts.delete(name);

        return `${name} removed successfully`;
    }
    
    find(name) {
        // Find by name
        return this.contacts.get(name) || "Contact not found";
    }
    
    findByPhone(phone) {
        // Find by phone number
        for (const [name, contact] of this.contacts) {

            if (contact.phone === phone) {
                return {
                    name,
                    ...contact
                };
            }

        }

        return "Phone number not found";
    }
    
    getAll() {
        // Return all contacts
        return this.contacts;
    }
}


// console
const phonebook = new Phonebook();

console.log(phonebook.add("Ranju", "9811111111", "ranju@gmail.com"));

console.log(phonebook.add("John", "9822222222", "john@gmail.com"));

console.log(phonebook.getAll());

console.log(phonebook.find("Ranju"));

console.log(phonebook.findByPhone("9822222222"));

console.log(phonebook.remove("John"));

console.log(phonebook.getAll());

/*
Ranju added successfully

John added successfully

Map(2) {
  'Ranju' => { phone: '9811111111', email: 'ranju@gmail.com' },
  'John' => { phone: '9822222222', email: 'john@gmail.com' }
}

{ phone: '9811111111', email: 'ranju@gmail.com' }

{
  name: 'John',
  phone: '9822222222',
  email: 'john@gmail.com'
}

John removed successfully

Map(1) {
  'Ranju' => { phone: '9811111111', email: 'ranju@gmail.com' }
}
*/