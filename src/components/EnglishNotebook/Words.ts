/*
interface DictionaryEntry {
    license: License;
    meanings: Meaning[];
    phonetic: string;
    phonetics: Phonetic[];
    sourceUrls: string[];
    word: string;
}

interface License {
    name: string;
    url: string;
}

interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    antonyms: string[];
    synonyms: string[];
}

interface Definition {
    antonyms: string[];
    definition: string;
    example: string;
    synonyms: string[];
}

interface Phonetic {
    audio: string;
    license?: License;
    sourceUrl?: string;
    text: string;
}
type DictionaryResponse = DictionaryEntry[];
export default DictionaryResponse;
*/

type xxApi = {
    bookId: string,
    phrases: {
        p_cn: string,
        p_content: string
    }[],
    relWords: {
        Hwds: {
            hwd: string,
            tran: string
        }[],
        Pos: string
    }[],
    sentences: {
        s_cn: string,
        s_content: string
    }[],
    synonyms: {
        Hwds: {
           word: string,
        }[],
        pos: string,
        tran: string
    }[],
    translations: {
        pos: string,
        tran_cn: string
    }[],
    ukphone: string,
    ukspeech: string,
    usphone: string,
    usspeech: string,
    word: string
}

export type {xxApi};