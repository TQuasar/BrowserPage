'use strict';
import type {definition, glossaryType, relationship, glossaryTemplate} from "./Types";

class Glossary {
    public static readonly baseTime: number = (new Date('2026-06-15T00:00:00')).getTime();
    static readonly DB_NAME = "EnglishNotebookGlossaryDB";
    static readonly STORE_NAME = "glossary";
    static readonly PASSED_NAME = "glossary_passed";
    static readonly DB_VERSION = 5;
    static readonly partOfSpeech = new Set(["n.", "v.", "adj.", "adv.", "pron.", "prep.", "conj.", "interj.", "int.", "art.", "num.", "abbr.", "aux.", "mod.", "vt.", "vi.", "cn.", "un.", "noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection", "article", "numeral", "abbreviation", "auxiliary verb", "modal verb", "transitive verb", "intransitive verb", "countable noun", "uncountable noun"]);
    static readonly abbr = {
        "n.": "n.",
        "v.": "v.",
        "adj.": "adj.",
        "adv.": "adv.",
        "pron.": "pron.",
        "prep.": "prep.",
        "conj.": "conj.",
        "interj.": "int.",
        "int.": "int.",
        "art.": "art.",
        "num.": "num.",
        "abbr.": "abbr.",
        "aux.": "aux.",
        "mod.": "mod.",
        "vt.": "vt.",
        "vi.": "vi.",
        "cn.": "cn.",
        "un.": "un.",
        "noun": "n.",
        "verb": "v.",
        "adjective": "adj.",
        "adverb": "adv.",
        "pronoun": "pron.",
        "preposition": "prep.",
        "conjunction": "conj.",
        "interjection": "int.",
        "article": "art.",
        "numeral": "num.",
        "abbreviation": "abbr.",
        "auxiliary verb": "aux.",
        "modal verb": "mod.",
        "transitive verb": "vt.",
        "intransitive verb": "vi.",
        "countable noun": "cn.",
        "uncountable noun": "un."
    } as const;
    static readonly relationship = new Set([...Array.from(Glossary.partOfSpeech), "pl.", "comp.", "sup.", "pt.", "pp.", "v.ing", "syn.", "ant.", "variant", "3s", "full"]);

    static glossary: Map<string, glossaryType> = new Map();
    static readonly template: glossaryTemplate = [
        ["w", "d", "p", "r", "e", "c", "t", "l", "rl"],
        ["", [], "", [], [], [], 10, Glossary.baseTime, Glossary.baseTime]
    ];
    static readonly supportsIndexedDB = typeof indexedDB !== "undefined" && indexedDB !== null;
    static dbPromise: Promise<IDBDatabase> | null = Glossary.supportsIndexedDB ? Glossary.openDB() : null;
    static refreshPinyinWords: boolean = true;

    static async getDB(): Promise<IDBDatabase> {
        if (!Glossary.supportsIndexedDB || !Glossary.dbPromise) {
            throw new Error("IndexedDB is not available.");
        }
        return Glossary.dbPromise;
    }

    static getAbbr(partOfSpeech: string) {
        if (Glossary.partOfSpeech.has(partOfSpeech)) {
            return Glossary.abbr[partOfSpeech as keyof typeof Glossary.abbr];
        }
        throw new Error(`Invalid part of speech: ${partOfSpeech}`);
    }

    static async openDB(): Promise<IDBDatabase> {
        if (!Glossary.supportsIndexedDB) {
            return Promise.reject(new Error("IndexedDB is not supported in this environment."));
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(Glossary.DB_NAME, Glossary.DB_VERSION);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(Glossary.STORE_NAME)) {
                    db.createObjectStore(Glossary.STORE_NAME, { keyPath: "w" });
                }
                if (!db.objectStoreNames.contains(Glossary.PASSED_NAME)) {
                    db.createObjectStore(Glossary.PASSED_NAME, { autoIncrement: true });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onblocked = () => console.warn("Glossary DB open blocked.");
        });
    }

    static clearLocalStorage() {
        localStorage.removeItem("glossary");
    }

    static async loadAllEntries(db: IDBDatabase): Promise<glossaryType[]> {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(Glossary.STORE_NAME, "readonly");
            const store = transaction.objectStore(Glossary.STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result as glossaryType[]);
            };
            request.onerror = () => reject(request.error);
        });
    }

    static async saveEntryToDB(entry: glossaryType): Promise<void> {
        if (!Glossary.supportsIndexedDB) {
            throw new Error("IndexedDB is not available.");
        }

        try {
            const db = await Glossary.getDB();
            const transaction = db.transaction(Glossary.STORE_NAME, "readwrite");
            const store = transaction.objectStore(Glossary.STORE_NAME);
            store.put(entry);
            await Glossary.awaitTransaction(transaction);
        } catch (error) {
            console.error(error);
        }
    }

    static async passedWordToDB(word: string) {
        if (!Glossary.supportsIndexedDB) throw new Error("IndexedDB is not available.");
        if (Glossary.glossary.has(word)) {
            try {
                const db: IDBDatabase = await Glossary.getDB();
                const transaction = db.transaction(Glossary.PASSED_NAME, "readwrite");
                const store = transaction.objectStore(Glossary.PASSED_NAME);
                store.put(word);
                await Glossary.awaitTransaction(transaction);

                this.deleteEntry(word);
            } catch (e) {
                console.error(e);
            }
        }
    }

    static async getPassedWord() {
        if (!Glossary.supportsIndexedDB) {
            throw new Error("IndexedDB is not available.");
        }
        const db = await this.getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(Glossary.PASSED_NAME, "readonly");
            const store = transaction.objectStore(Glossary.PASSED_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result as string[]);
            };
            request.onerror = () => reject(request.error);
        });
    }

    static async deleteEntryFromDB(word: string): Promise<void> {
        if (!Glossary.supportsIndexedDB) {
            throw new Error("IndexedDB is not available.");
        }

        try {
            const db = await Glossary.getDB();
            const transaction = db.transaction(Glossary.STORE_NAME, "readwrite");
            const store = transaction.objectStore(Glossary.STORE_NAME);
            store.delete(word);
            await Glossary.awaitTransaction(transaction);
        } catch (error) {
            console.error(error);
        }
    }

    static async saveAllToDB(): Promise<void> {
        if (!Glossary.supportsIndexedDB) {
            throw new Error("IndexedDB is not available.");
        }

        try {
            const db = await Glossary.getDB();
            const transaction = db.transaction(Glossary.STORE_NAME, "readwrite");
            const store = transaction.objectStore(Glossary.STORE_NAME);
            store.clear();
            for (const entry of this.glossary.values()) {
                store.put(entry);
            }
            await Glossary.awaitTransaction(transaction);
        } catch (error) {
            console.error(error);
        }
    }

    static async awaitTransaction(transaction: IDBTransaction): Promise<void> {
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
    }

    static async initialize() {
        if (!Glossary.supportsIndexedDB) {
            throw new Error("IndexedDB is not available.");
        }

        try {
            const db = await Glossary.getDB();
            const storedEntries = await Glossary.loadAllEntries(db);
            if (storedEntries.length > 0) {
                this.glossary = new Map(storedEntries.map(entry => [entry.w, entry]));
            } else if (this.glossary.size > 0) {
                await Glossary.saveAllToDB();
                this.clearLocalStorage();
            }
        } catch (error) {
            console.error(error);
        }
    }

    static #checkDefinition(definition: [partOfSpeech: string, translation: string][]) {
        if (!Array.isArray(definition)) {
            throw new Error("Definition must be an array");
        }
        for (const [partOfSpeech, translation] of definition) {
            if (!this.partOfSpeech.has(partOfSpeech)) {
                throw new Error(`Invalid part of speech: ${partOfSpeech}`);
            }
            if (typeof translation !== "string") {
                throw new Error("Translation must be a string");
            }
        }
    }

    static #checkRelationship(relationship: relationship) {
        if (!Array.isArray(relationship)) {
            throw new Error("Definition must be an array");
        }
        for (const relation of relationship) {
            if (!this.relationship.has(relation.label)) {
                throw new Error(`Invalid relationship: ${relationship}`);
            }
        }
    }

    /**
     * @param {string} word - The word to be added to the glossary.
     * @param {definition} definition - The part of speech for the word (e.g., "n.", "v.", "adj.").
     * @param {string} pronunciation - The phonetic symbol of the word (default is an empty string).
     * @param {relationship} relationship - Associate with other vocabulary.
     * @param {string[]} examples - An array of example sentences using the word (default is an empty array).
     * @param {string[]} comment - Comments for the word.
     * @param {number} type - A 1(familiar) ~ 10(unfamiliar) value, it shows that how your familiarity with words.
     */
    static addEntry(word: string, definition: definition = [], pronunciation: string = "", relationship: relationship = [], examples: string[] = [], comment: string[] = [], type: number) {
        this.#checkDefinition(definition);
        this.#checkRelationship(relationship);

        definition.forEach(entry => entry[0] = this.getAbbr(entry[0]));
        const entry = {
            "w": word,
            "d": definition,
            "p": pronunciation,
            "r": relationship,
            "e": examples,
            "c": comment,
            "t": Math.max(Math.min(type, 10), 1),
            "l": (new Date()).getTime() - Glossary.baseTime,
            "rl": this.glossary.get(word)?.rl ?? (new Date()).getTime()
        };
        this.glossary.set(word, entry);
        void Glossary.saveEntryToDB(entry);
        this.refreshPinyinWords = true;
    }

    private static checkProperties(word: object | undefined): glossaryType | undefined {
        if (!word) return word;

        Glossary.template[0].forEach((key, index) => {
            if (!Object.hasOwn(word, key)) {
                word[key] = Glossary.template[1][index];
            }
        });

        this.saveEntryToDB(<glossaryType>word).then();
        return <glossaryType>word;
    }

    static getEntry(word: string) {
        return this.checkProperties(this.glossary.get(word));
        //return this.glossary.get(word);
    }

    static deleteEntry(word: string) {
        this.glossary.delete(word);
        this.refreshPinyinWords = true;
        void Glossary.deleteEntryFromDB(word);
    }

    static size() {
        return this.glossary.size;
    }

    private static levenshteinDistance(a: string, b: string): number {
        const matrix: number[][] = [];

        // 初始化矩阵
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // 填充矩阵
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // 替换
                        matrix[i][j - 1] + 1,     // 插入
                        matrix[i - 1][j] + 1      // 删除
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    private static searchAny(from: string[], query: string, maxSuggestions: number = 10, minSimilarity: number = 0.2): string[] {
        const suggestions: { item: string; similarity: number }[] = [];

        for (const item of from) {
            const distance = Glossary.levenshteinDistance(query, item);
            const maxLength = Math.max(query.length, item.length);
            const factor = Math.pow(Math.min(query.length, item.length) / maxLength, 1.5);
            const similarity = (1 - distance / maxLength) * factor;

            if (similarity >= minSimilarity) {
                suggestions.push({ item, similarity });
            }
        }

        // 按相似度降序排序
        suggestions.sort((a, b) => b.similarity - a.similarity);

        // 返回最多 maxSuggestions 个建议
        return suggestions.slice(0, maxSuggestions).map(suggestion => suggestion.item);
    }

    static searchWord(query: string, maxSuggestions: number = 10, minSimilarity: number = 0.2): string[] {
        return this.searchAny(this.glossary.keys().toArray(), query, maxSuggestions, minSimilarity);
    }

    static changeTypeLevel(word: string, plus: number) {
        if (!this.glossary.has(word)) return;
        const value = Glossary.getEntry(word)!;
        Glossary.addEntry(value.w, value.d, value.p, value.r, value.e, value.c, Math.max(Math.min(value.t + plus, 10), 1));
    }
}

await Glossary.initialize();
await Glossary.passedWordToDB("upgrade");
console.log(await Glossary.getPassedWord());

export { Glossary };