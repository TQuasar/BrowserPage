import {Component, Ref} from "vue";

type definition = [partOfSpeech: string, translation: string][];
type glossaryType = { w: string; d: definition; p: string; r: object; e: string[]; c: string[]};
type relationship = {label: string, word: string;}[];
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

type autocomplete = (word: Ref<string>, pronunciation: Ref<string>, definitions: Ref<definition>, relationships: Ref<relationship>, examples: Ref<string[]>) => void;

export {definition, glossaryType, relationship, Page, PageDef, autocomplete};
