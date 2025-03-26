const fs = require("fs");
const path = require("path");
const { DocumentProcessor } = require("./documentProcessor");
const { TfIdfCalculator } = require("./tfidfCalculator");
const { InvertedIndex } = require("./invertedIndex");

function welcomePage() {
    const welcomeText = `
╔════════════════════════════════════════════════════╗
║                                                    ║
║               Welcome to IR System!                ║
║                                                    ║
║     An Information Retrieval System using          ║
║      Inverted Index and Vector Space Model         ║
║                                                    ║
║         Created by:                                ║
║                                                    ║
╚════════════════════════════════════════════════════╝
`;
    console.log(welcomeText);
}

function getQuery() {
    const readline = require("readline-sync");
    console.log();
    const query = readline.question("Please enter your query: ");
    console.log();
    return query;
}

function main() {
    const corpusDir = "corpus";
    const documents = [];
    const docName = new Map();
    let idx = 0;

    fs.readdirSync(corpusDir).forEach((filename) => {
        if (filename.endsWith(".txt")) {
            const filePath = path.join(corpusDir, filename);
            const content = fs.readFileSync(filePath, "utf-8");
            docName.set(idx, filename.slice(0, -4));
            documents.push(content);
            idx++;
        }
    });

    const processor = new DocumentProcessor();
    const invertedIndex = new InvertedIndex();
    const tfidfCalculator = new TfIdfCalculator(invertedIndex);

    const preprocessedDocs = documents.map((doc) => processor.preprocess(doc));

    invertedIndex.createIndex(preprocessedDocs);
    const tfidfDocs = tfidfCalculator.computeTfidf(preprocessedDocs);

    const query = getQuery();
    const preprocessedQuery = processor.preprocess(query);
    const results = tfidfCalculator.retrieveDocuments(
        preprocessedQuery,
        tfidfDocs
    );

    if (results.length === 0) {
        console.log("There is no documents that contain your query");
    } else {
        results.forEach(([idx, sim]) => {
            console.log(`${docName.get(idx)}: (Similarity: ${sim.toFixed(4)})`);
        });
    }
    console.log("-----------------------------------------------------");
    main();
}

module.exports = { main };
