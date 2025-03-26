class InvertedIndex {
    constructor() {
        this.docFreq = new Map();
        this.termFreq = new Map();
    }

    createIndex(docs) {
        docs.forEach((doc, docId) => {
            doc.forEach((term) => {
                if (!this.termFreq.has(term)) {
                    this.termFreq.set(term, new Map());
                }
                const termDocFreq = this.termFreq.get(term);
                termDocFreq.set(docId, (termDocFreq.get(docId) || 0) + 1);
            });
        });

        this.termFreq.forEach((termDocFreq, term) => {
            this.docFreq.set(term, termDocFreq.size);
        });
    }
}

module.exports = { InvertedIndex };
