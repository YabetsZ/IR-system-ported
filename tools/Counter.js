class Counter {
    constructor(iterable) {
        this.counter = new Map();
        if (iterable) {
            iterable.forEach((item) => {
                this.increment(item);
            });
        }
        return this.counter;
    }

    increment(item) {
        this.counter.set(item, (this.counter.get(item) || 0) + 1);
    }

    decrement(item) {
        const count = this.counter.get(item);
        if (count === 1) {
            this.counter.delete(item);
        } else if (count) {
            this.counter.set(item, count - 1);
        }
    }
}
