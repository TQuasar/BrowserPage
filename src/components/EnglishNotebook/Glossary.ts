'use strict';
import type {definition, glossaryType, relationship} from "./Types";

class Glossary {
    static partOfSpeech = new Set(["n.", "v.", "adj.", "adv.", "pron.", "prep.", "conj.", "interj.", "int.", "art.", "num.", "abbr.", "aux.", "mod.", "vt.", "vi.", "cn.", "un.",   "noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection", "article", "numeral", "abbreviation", "auxiliary verb", "modal verb", "transitive verb", "intransitive verb", "countable noun", "uncountable noun"]);
    static relationship = new Set([...Array.from(Glossary.partOfSpeech), "pl.", "comp.", "sup.", "pt.", "pp.", "v.ing", "syn.", "ant.", "variant", "3s", "full"])

    /**
     * @type {Map<string, { word: string, definition: definition, pronunciation: string, relationship: Object, examples: string[] }>}
     */
    static glossary: Map<string, glossaryType> = new Map();

    static readGlossary(glossary = null) {
        if (glossary) {
            this.glossary = glossary;
        } else {
            const glossary: string | null = localStorage.getItem('glossary');
            if (glossary) {
                /* 根据JSON列表自动补齐为Map，以每一项的word为键 */
                this.glossary = new Map(JSON.parse(glossary).map((entry: glossaryType): (string | glossaryType)[] => [entry.w, entry]));
            } else {
                this.glossary = new Map();
                this.saveGlossary();
            }
        }
    }

    static saveGlossary() {
        localStorage.setItem('glossary', JSON.stringify(Array.from(this.glossary.values())));
    }

    static clearGlossary() {
        this.glossary.clear();
        this.saveGlossary();
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
     */
    static addEntry(word: string, definition: definition = [], pronunciation: string = "", relationship: relationship = [], examples: string[] = [], comment: string[] = []) {
        this.#checkDefinition(definition);
        this.#checkRelationship(relationship);

        const entry = {"w": word, "d": definition, "p": pronunciation, "r": relationship, "e": examples, "c": comment };
        this.glossary.set(word, entry);
        this.saveGlossary();
    }

    static getEntry(word: string) {
        return this.glossary.get(word);
    }

    static deleteEntry(word: string) {
        this.glossary.delete(word);
        this.saveGlossary();
    }

    static size() {
        return this.glossary.size;
    }

    static #levenshteinDistance(a: string, b: string): number {
        const matrix = [];

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

    static search(query: string, maxSuggestions: number = 10, minSimilarity: number = 0.2): string[] {
        const suggestions: { word: string; similarity: number }[] = [];

        // 遍历词库中的每个单词，计算与查询字符串的编辑距离，并记录相似度分数
        for (const [word] of this.glossary) {
            const distance = this.#levenshteinDistance(query, word);
            const maxLength = Math.max(query.length, word.length);
            const similarity = 1 - distance / maxLength;

            if (similarity >= minSimilarity) {
                suggestions.push({ word, similarity });
            }
        }

        // 按相似度降序排序
        suggestions.sort((a, b) => b.similarity - a.similarity);

        // 返回最多 maxSuggestions 个建议
        return suggestions.slice(0, maxSuggestions).map(suggestion => suggestion.word);
    }
}
Glossary.readGlossary();

export { Glossary };