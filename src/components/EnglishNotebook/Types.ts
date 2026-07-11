import {Component, Ref} from "vue";

type definition = [partOfSpeech: string, translation: string][];
type relationship = {label: string, word: string;}[];
type glossaryType = { w: string; d: definition; p: string; r: relationship; e: string[]; c: string[]; t: number; l: number; rl: number};
type Page = {
    id: number;
    title: string;
    content: string;
};

type PageDef = {
    id: number;
    title: string;
    content: string;
    component: Component;
};

type glossaryTemplate = [string[], unknown[]];

type autocomplete = (word: Ref<string>, pronunciation: Ref<string>, definitions: Ref<definition>, relationships: Ref<relationship>, examples: Ref<string[]>) => void;

export {definition, glossaryType, relationship, Page, PageDef, glossaryTemplate, autocomplete};
