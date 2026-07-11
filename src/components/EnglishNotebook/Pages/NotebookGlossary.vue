<script setup lang="ts">
import {Glossary} from "@components/EnglishNotebook/Glossary";
import Button from "@components/components/Button.vue";
import List from "@components/components/List.vue";
import {computed, inject, Ref, ref} from "vue";
import Checkbox from "@components/components/Checkbox.vue";

const glossary = ref(Array.from(Glossary.glossary.keys()));

type sortWay = 'difficulty' | 'alphabet' | 'time';
const sortWay: Ref<sortWay> = ref("difficulty");
const sortFunc = {
  'difficulty': (a: string, b: string) => Glossary.getEntry(b)!.t - Glossary.getEntry(a)!.t,
  'alphabet': (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()),
  'time': (a: string, b: string) => Glossary.getEntry(a)!.rl - Glossary.getEntry(b)!.rl
}
function chooseSortWay(way: sortWay) {
  sortWay.value = way;
  glossary.value.sort(sortFunc[way]);
}
const resetGlossary = () => chooseSortWay(sortWay.value);

chooseSortWay('difficulty');

const openWordPage = <(word: string)=>void>inject("openWordPage");
const moodsIcon = <string[]>inject("moodsIcon");
const showDetail = ref(true);
</script>

<template>
  <Button type="default" size="medium" plain @click="resetGlossary">Refresh</Button>
  <Button style="margin-left: 15px;" type="info" size="medium" plain @click="showDetail = !showDetail">{{ showDetail ? "hide details" : "show details" }}</Button>

  <section id="sortWayBox">
    <span><Checkbox @click="chooseSortWay('difficulty')" :modelValue="sortWay === 'difficulty'"/><span>sort by difficulty</span></span>
    <span><Checkbox @click="chooseSortWay('alphabet')" :modelValue="sortWay === 'alphabet'"/><span>sort by alphabet</span></span>
    <span><Checkbox @click="chooseSortWay('time')" :modelValue="sortWay === 'time'"/><span>sort by time</span></span>
  </section>

  <List :items="glossary" order="no" v-slot="{ item }" id="searchWordsList">
    <div class="search-item">
      <img style="pointer-events: none;" :src="moodsIcon[(Glossary.getEntry(item)!.t-1)!]" alt="图片" width="16" height="16" >
      <span @click="openWordPage(item)" class="word-link">
        <span v-if="showDetail" class="word-partOfSpeech">{{ Glossary.getEntry(item)?.d.map(d => d[0]).join('/ ') }}</span>
        <span class="word-spell">{{ item }}</span>
        <span v-if="showDetail" class="word-pronunciation">{{ Glossary.getEntry(item)?.p }}</span>
        <span v-if="showDetail" class="word-translate">{{ Glossary.getEntry(item)?.d.map(d => d[1]).join(';') }}</span>
      </span>
      <Button type="success" size="smaller" plain @click="Glossary.changeTypeLevel(item, -1);resetGlossary()">upgrade</Button>
      <Button type="danger" size="smaller" plain @click="Glossary.changeTypeLevel(item, 1);resetGlossary()">downgrade</Button>
      <Button v-if="showDetail" type="danger" size="smaller" plain @click="Glossary.deleteEntry(item);resetGlossary()">Delete</Button>
    </div>
  </List>
</template>

<style scoped>
#sortWayBox {
  margin-left: 15px;
  display: inline-flex;
  gap: 5px;
}

#sortWayBox > span > span {
  font-size: 12px;
  color: #3b3a34;
  user-select: none;
}

#searchWordsList {
  margin-left: 0;
  text-align: left;
  width: 90%;
  box-sizing: content-box;
}
.search-item {
  height: 20px;
  display: flex;
  align-items: center;
}
.word-link {
  flex-grow: 1;
}
.word-partOfSpeech {
  font-size: 12px;
  color: #3b3a34;
}
.word-spell {
  font-size: 14px;
}
.word-pronunciation {
  font-size: 10px;
  color: #9E9E9E;
}
.word-translate {
  font-size: 12px;
  color: #454545;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>