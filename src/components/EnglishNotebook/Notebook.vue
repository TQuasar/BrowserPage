<script setup lang="ts">
import {computed, ref, shallowRef, provide, Ref} from "vue";
import NotebookHeader from "@components/EnglishNotebook/NotebookHeader.vue";
import NotebookMain from "@components/EnglishNotebook/NotebookMain.vue";
import NotebookWord from "@components/EnglishNotebook/Pages/NotebookWord.vue";
import {Glossary} from "@components/EnglishNotebook/Glossary";

void Glossary;

import type { Component } from "vue";
import NotebookHome from "@components/EnglishNotebook/Pages/NotebookHome.vue";
import NotebookPrint from "@components/EnglishNotebook/Pages/NotebookPrint.vue";
import Tips from "@components/Tips/Tips";
import type {xxApi} from "@components/EnglishNotebook/Words";
import type {autocomplete, definition, PageDef, relationship} from "@components/EnglishNotebook/Types";

const pages = shallowRef<PageDef[]>([
  { id: 0, title: "Home", content: "", component: NotebookHome }
]);

const currentPageId = ref(0);
const nextPageId = ref(pages.value.length);

const currentPage = computed(() => {
  return pages.value.find((page) => page.id === currentPageId.value) ?? pages.value[0];
});

const selectPage = (pageId: number) => {
  currentPageId.value = pageId;
};

const deletePage = (pageId: number) => {
  let pageIndex = 1;
  pages.value = pages.value.filter((page, index) => {
    if (page.id === pageId) pageIndex = index;
    return  page.id !== pageId
  });

  if (pages.value.length == 0) {
    addPage("Home", "", NotebookHome);
  } else if (currentPageId.value === pageId) {
    currentPageId.value = pages.value[Math.max(0, pageIndex-1)].id;
  }
};

const addPage = (title: string, content: string, component: Component) => {
  const newPage = { "id": nextPageId.value, "title": title, "content": content, "component": component };
  pages.value.push(newPage);
  currentPageId.value = newPage.id;
  nextPageId.value++;
};

const openHome = () => {
  addPage("Home", "", NotebookHome);
};
const openWordPage = (word: string) => {
  addPage(`Word-${word}`, word, NotebookWord);
}
const openPrint = (word: string | undefined) => {
  addPage(`Print ${word ? word : "All"}`, word ?? "", NotebookPrint);
}
openPrint(undefined);

provide("openWordPage", openWordPage);
provide("goHome", () => {
  let end = false;
  pages.value.forEach(p => {
    if (p.title === "Home") {
      selectPage(p.id);
      end = true;
      return;
    }
  });
  if (!end) openHome();
});
provide("print", openPrint);
provide("autocompleteWords", <autocomplete>(async (word: Ref<string>, pronunciation: Ref<string>, definitions: Ref<definition>, relationships: Ref<relationship>, examples: Ref<string[]>) => {
  if (!word.value.trim()) {
    Tips.addTip({type: "error", text: "No input words.", time: 1000});
    return;
  }

  const tipId = Tips.addTip({type: "loading", text: "Try autocompleting information.", time: 9999999});
  try {
    const response = await (await fetch(`https://v2.xxapi.cn/api/englishwords?word=${word.value}`)).json();
    if (response.code == 200) {
      const data: xxApi = <xxApi> response.data;
      console.log(data);
      pronunciation.value = `/${([data.ukphone.trim(), data.usphone.trim()]).join("; ")}/`;
      definitions.value = data.translations.map(entry => [`${entry.pos}.`, entry.tran_cn]);
      examples.value = data.sentences.map(sentence => sentence.s_content);
      relationships.value = data.relWords.map(words => words.Hwds.map(word => ({"label": `${words.Pos}.`, "word": word.hwd}))).flat();
    }
  } catch (e) {
    console.error(e);
    Tips.addTip({type: "error", text: "Failed to autocomplete.", time: 1000});
  } finally {
    Tips.deleteTip(tipId);
  }
}));
</script>

<template>
  <div id="notebookView">
    <NotebookHeader
      :pages="pages"
      :current-page-id="currentPageId"
      @select-page="selectPage"
      @delete-page="deletePage"
    />
    <NotebookMain :page="currentPage" />
  </div>
</template>

<style scoped>
#notebookView {
  width: 90vw;
  height: 90vh;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  border-radius: 10px;
  border: #ddd0af 3px solid;
  margin: 0;
  padding: 0;
  background-color: #eae9d7;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>