const math = require("mathjs");
const { Counter } = require("collections/counter");

class TfIdfCalculator {
    constructor(invertedIndex) {
        this.invertedIndex = invertedIndex;
        this.idf = new Map();
    }

    computeIdf(nDocs) {
        this.invertedIndex.docFreq.forEach((df, term) => {
            this.idf.set(term, Math.log(nDocs / df));
        });
    }

    computeTfidf(docs) {
        const tfidfDocs = [];
        this.computeIdf(docs.length);

        docs.forEach((doc, docId) => {
            const tfidf = {};
            doc.forEach((term) => {
                const tf =
                    this.invertedIndex.termFreq.get(term).get(docId) /
                    doc.length;
                tfidf[term] = tf * this.idf.get(term);
            });
            tfidfDocs.push(tfidf);
        });

        return tfidfDocs;
    }

    retrieveDocuments(query, tfidfDocs) {
        const queryTf = new Counter(query);
        const queryTfidf = {};
        queryTf.forEach((tfVal, term) => {
            queryTfidf[term] =
                (tfVal / query.length) * (this.idf.get(term) || 0);
        });

        const similarities = tfidfDocs.map((docTfidf, idx) => {
            const sim = this.cosineSimilarity(queryTfidf, docTfidf);
            return [idx, sim];
        });

        similarities.sort((a, b) => b[1] - a[1]);
        return similarities.filter(([idx, sim]) => sim > 0);
    }

    cosineSimilarity(vec1, vec2) {
        const dotProduct = Object.keys(vec1).reduce(
            (sum, term) => sum + vec1[term] * (vec2[term] || 0),
            0
        );
        const norm1 = Math.sqrt(
            Object.values(vec1).reduce((sum, val) => sum + val ** 2, 0)
        );
        const norm2 = Math.sqrt(
            Object.values(vec2).reduce((sum, val) => sum + val ** 2, 0)
        );
        if (norm1 === 0 || norm2 === 0) {
            return 0.0;
        }
        return dotProduct / (norm1 * norm2);
    }
}

module.exports = { TfIdfCalculator };
