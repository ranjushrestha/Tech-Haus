class TaskQueue {
    constructor() {
        this.tasks = [];
    }

    enqueue(task) {
        // Add to end
        this.tasks[this.tasks.length] = task;
    }

    dequeue() {
        // Remove first item
        if (this.isEmpty()) {
            return undefined;
        }

        const firstTask = this.tasks[0];
        const result = [];

        for (let i = 1; i < this.tasks.length; i++) {
            result[result.length] = this.tasks[i];
        }

        this.tasks = result;

        return firstTask;
    }

    peek() {
        // View first item
        return this.tasks[0];
    }

    isEmpty() {
        return this.tasks.length === 0;
    }

    size() {
        return this.tasks.length;
    }

    clear() {
        this.tasks = [];
    }
}


const queue = new TaskQueue();

queue.enqueue("Task 1");
queue.enqueue("Task 2");
queue.enqueue("Task 3");

console.log(queue.tasks);

console.log(queue.dequeue());

console.log(queue.tasks);

console.log(queue.peek());

console.log(queue.size());

console.log(queue.isEmpty());

queue.clear();

console.log(queue.tasks);

console.log(queue.isEmpty());