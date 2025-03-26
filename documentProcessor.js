const { PorterStemmer } = require("./stemmer");

class DocumentProcessor {
    constructor() {
        this.stopWords = new Set([
            "the",
            "and",
            "is",
            "in",
            "it",
            "of",
            "to",
            "a",
            "an",
        ]);
        this.stemmer = new PorterStemmer();
    }

    preprocess(text) {
        const words = text.split(/\s+/);
        return words
            .map((word) =>
                this.stemmer.stem(word.toLowerCase().replace(/[^\w\s]|_/g, ""))
            )
            .filter((word) => !this.stopWords.has(word));
    }
}

module.exports = { DocumentProcessor };
