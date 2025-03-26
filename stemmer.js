class PorterStemmer {
    constructor() {
        // constructor(debug = false)
        this.step2Suffixes = {
            ational: "ate",
            tional: "tion",
            enci: "ence",
            anci: "ance",
            izer: "ize",
            bli: "ble",
            alli: "al",
            entli: "ent",
            eli: "e",
            ousli: "ous",
            ization: "ize",
            ation: "ate",
            ator: "ate",
            alism: "al",
            iveness: "ive",
            fulness: "ful",
            ousness: "ous",
            aliti: "al",
            iviti: "ive",
            biliti: "ble",
            logi: "log",
        };

        this.step3Suffixes = {
            icate: "ic",
            ative: "",
            alize: "al",
            iciti: "ic",
            ical: "ic",
            ful: "",
            ness: "",
        };

        this.consonant = "[^aeiou]";
        this.vowel = "[aeiouy]";
        this.consonantSeq = this.consonant + "[^aeiouy]*";
        this.vowelSeq = this.vowel + "[aeiou]*";

        this.mgr0 =
            "^(" + this.consonantSeq + ")?" + this.vowelSeq + this.consonantSeq;
        this.meq1 =
            "^(" +
            this.consonantSeq +
            ")?" +
            this.vowelSeq +
            this.consonantSeq +
            "(" +
            this.vowelSeq +
            ")?$";
        this.mgr1 =
            "^(" +
            this.consonantSeq +
            ")?" +
            this.vowelSeq +
            this.consonantSeq +
            this.vowelSeq +
            this.consonantSeq;
        this.hasVowel = "^(" + this.consonantSeq + ")?" + this.vowel;

        //   this.debugFunction = debug ? this.realDebug : this.dummyDebug;
    }

    // dummyDebug() {}

    // realDebug(...args) {
    //   console.log(args.join(' '));
    // }

    stem(word) {
        let suffix,
            firstChar,
            regex,
            regex2,
            regex3,
            regex4,
            originalWord = word;

        if (word.length < 3) return word;

        firstChar = word.charAt(0);
        if (firstChar === "y") {
            word = firstChar.toUpperCase() + word.slice(1);
        }

        // Step 1a
        regex = /^(.+?)(ss|i)es$/;
        regex2 = /^(.+?)([^s])s$/;

        if (regex.test(word)) {
            word = word.replace(regex, "$1$2");
            this.debugFunction("1a", regex, word);
        } else if (regex2.test(word)) {
            word = word.replace(regex2, "$1$2");
            this.debugFunction("1a", regex2, word);
        }

        // Step 1b
        regex = /^(.+?)eed$/;
        regex2 = /^(.+?)(ed|ing)$/;
        if (regex.test(word)) {
            let match = regex.exec(word);
            regex = new RegExp(this.mgr0);
            if (regex.test(match[1])) {
                regex = /.$/;
                word = word.replace(regex, "");
                this.debugFunction("1b", regex, word);
            }
        } else if (regex2.test(word)) {
            let match = regex2.exec(word);
            let stem = match[1];
            regex2 = new RegExp(this.hasVowel);
            if (regex2.test(stem)) {
                word = stem;
                this.debugFunction("1b", regex2, word);

                regex2 = /(at|bl|iz)$/;
                regex3 = new RegExp("([^aeiouylsz])\\1$");
                regex4 = new RegExp(
                    "^" + this.consonantSeq + this.vowel + "[^aeiouwxy]$"
                );

                if (regex2.test(word)) {
                    word = word + "e";
                    this.debugFunction("1b", regex2, word);
                } else if (regex3.test(word)) {
                    regex = /.$/;
                    word = word.replace(regex, "");
                    this.debugFunction("1b", regex3, word);
                } else if (regex4.test(word)) {
                    word = word + "e";
                    this.debugFunction("1b", regex4, word);
                }
            }
        }

        // Step 1c
        regex = new RegExp("^(.*" + this.vowel + ".*)y$");
        if (regex.test(word)) {
            let match = regex.exec(word);
            let stem = match[1];
            word = stem + "i";
            this.debugFunction("1c", regex, word);
        }

        // Step 2
        regex =
            /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
        if (regex.test(word)) {
            let match = regex.exec(word);
            let stem = match[1];
            suffix = match[2];
            regex = new RegExp(this.mgr0);
            if (regex.test(stem)) {
                word = stem + this.step2Suffixes[suffix];
                this.debugFunction("2", regex, word);
            }
        }

        // Step 3
        regex = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
        if (regex.test(word)) {
            let match = regex.exec(word);
            let stem = match[1];
            suffix = match[2];
            regex = new RegExp(this.mgr0);
            if (regex.test(stem)) {
                word = stem + this.step3Suffixes[suffix];
                this.debugFunction("3", regex, word);
            }
        }

        // Step 4
        regex =
            /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
        regex2 = /^(.+?)(s|t)(ion)$/;
        if (regex.test(word)) {
            let match = regex.exec(word);
            let stem = match[1];
            regex = new RegExp(this.mgr1);
            if (regex.test(stem)) {
                word = stem;
                this.debugFunction("4", regex, word);
            }
        } else if (regex2.test(word)) {
            let match = regex2.exec(word);
            let stem = match[1] + match[2];
            regex2 = new RegExp(this.mgr1);
            if (regex2.test(stem)) {
                word = stem;
                this.debugFunction("4", regex2, word);
            }
        }

        // Step 5
        regex = /^(.+?)e$/;
        if (regex.test(word)) {
            let match = regex.exec(word);
            let stem = match[1];
            regex = new RegExp(this.mgr1);
            regex2 = new RegExp(this.meq1);
            regex3 = new RegExp(
                "^" + this.consonantSeq + this.vowel + "[^aeiouwxy]$"
            );
            if (regex.test(stem) || (regex2.test(stem) && !regex3.test(stem))) {
                word = stem;
                this.debugFunction("5", regex, regex2, regex3, word);
            }
        }

        regex = /ll$/;
        regex2 = new RegExp(this.mgr1);
        if (regex.test(word) && regex2.test(word)) {
            regex = /.$/;
            word = word.replace(regex, "");
            this.debugFunction("5", regex, regex2, word);
        }

        // and turn initial Y back to y
        if (firstChar === "y") {
            word = firstChar.toLowerCase() + word.slice(1);
        }

        return word;
    }
}

module.exports = { PorterStemmer };
