<script setup lang="ts">
import { Glossary } from "@components/EnglishNotebook/Glossary";
import { ref, inject } from "vue";
import Input from "@components/components/Input.vue";
import Button from "@components/components/Button.vue";
import List from "@components/components/List.vue";
import { useGlossaryForm } from "@components/EnglishNotebook/useGlossaryForm";
import type { autocomplete } from "@components/EnglishNotebook/Types";

const searchValue = ref("");
const searchResult = ref<string[]>([]);
const {
  word,
  pronunciation,
  definitions,
  relationships,
  examples,
  comments,
  normalizedDefinitions,
  normalizedRelationships,
  normalizedExamples,
  normalizedComments,
  addDefinition,
  removeDefinition,
  addRelationship,
  removeRelationship,
  addExample,
  removeExample,
  addComment,
  removeComment,
  resetForm,
} = useGlossaryForm();

const showAllWords = () => {
  searchResult.value = Array.from(Glossary.glossary.keys());
};

const searchWords = (value: string) => {
  searchValue.value = String(value);
  if (!searchValue.value.trim()) {
    showAllWords();
    return;
  }
  searchResult.value = Glossary.search(searchValue.value.trim());
};

const addWord = () => {
  const trimmedWord = word.value.trim();
  if (!trimmedWord) {
    return;
  }
  Glossary.addEntry(
    trimmedWord,
    normalizedDefinitions.value,
    pronunciation.value.trim(),
    normalizedRelationships.value,
    normalizedExamples.value,
    normalizedComments.value,
  );

  resetForm();
  showAllWords();
};

const autocomplete = (<autocomplete>inject("autocompleteWords")).bind(null, word, pronunciation, definitions, relationships, examples);

showAllWords();

const openWordPage = inject("openWordPage");
</script>

<template>
  <div class="notebook-home">
    <h1>Welcome to TQuasar's English notebook!</h1>
    <p>You can record the words you don't know and the sentences you like.</p>
    <hr/>

    <section class="word-summary">
      <h2>Words</h2>
      <p>You recorded a total of {{ Glossary.size() }} word(s)!</p>
    </section>

    <section class="word-form">
      <h3>Add a new word</h3>
      <div class="form-row">
        <Input v-model="word" placeholder="Word" width="20%" />
        <Input v-model="pronunciation" placeholder="Pronunciation" width="20%" />
      </div>
      <!-- Definition -->
      <div class="nested-group">
        <div class="group-header">
          <span>Definitions</span>
          <Button type="success" size="small" @click="addDefinition">+ Add definition</Button>
        </div>
        <div v-for="(definition, index) in definitions" :key="index" class="form-row">
          <Input v-model="definition[0]" placeholder="Part of speech (e.g. n.)" width="20%" />
          <Input v-model="definition[1]" placeholder="Translation" width="50%" />
          <Button type="danger" size="small" plain @click="() => removeDefinition(index)">Remove</Button>
        </div>
      </div>
      <!-- Relationship -->
      <div class="nested-group">
        <div class="group-header">
          <span>Relationship</span>
          <Button type="success" size="small" @click="addRelationship">+ Add relation</Button>
        </div>
        <div v-for="(relationship, index) in relationships" :key="index" class="form-row">
          <Input v-model="relationship.label" placeholder="Relation type" width="20%" />
          <Input v-model="relationship.word" placeholder="Relation word" width="50%" />
          <Button type="danger" size="small" plain @click="() => removeRelationship(index)">Remove</Button>
        </div>
      </div>
      <!-- Examples -->
      <div class="nested-group">
        <div class="group-header">
          <span>Examples</span>
          <Button type="success" size="small" @click="addExample">+ Add example</Button>
        </div>
        <div v-for="(example, index) in examples" :key="index" class="form-row">
          <Input v-model="examples[index]" placeholder="Example sentence" width="80%" />
          <Button type="danger" size="small" plain @click="() => removeExample(index)">Remove</Button>
        </div>
      </div>
      <!-- Comments -->
      <div class="nested-group">
        <div class="group-header">
          <span>Comment</span>
          <Button type="success" size="small" @click="addComment">+ Add comment</Button>
        </div>
        <div v-for="(comment, index) in comments" :key="index" class="form-row">
          <Input v-model="comments[index]" placeholder="Introduction to this word" width="80%" />
          <Button type="danger" size="small" plain @click="() => removeComment(index)">Remove</Button>
        </div>
      </div>
      <!-- Save word -->
      <div class="actions">
        <Button type="primary" @click="addWord">Save Word</Button>
        <Button type="primary" @click="autocomplete">Autocomplete</Button>
      </div>
    </section>

    <section class="search-section">
      <h3>Search Words</h3>
      <Input
        :model-value="searchValue"
        @input="e => searchWords(String(e))"
        placeholder="Search word..."
        width="90%"
      />
      <List :items="searchResult" order="no" v-slot="{ item }" id="searchWordsList">
        <div class="search-item" @click="() => openWordPage(item)">
          <span class="word-partOfSpeech">{{ Glossary.getEntry(item)?.d.map(d => d[0]).join('/ ') }}</span>
          <span class="word-spell">{{ item }}</span>
          <span class="word-pronunciation">{{ Glossary.getEntry(item)?.p }}</span>
          <span class="word-translate">{{ Glossary.getEntry(item)?.d.map(d => d[1]).join(';') }}</span>
          <Button type="danger" size="smaller" plain @click="event => {Glossary.deleteEntry(item);showAllWords()}">Delete</Button>
        </div>
      </List>
    </section>
  </div>
</template>

<style scoped>
.notebook-home {
  padding: 16px;
}
.word-summary {
  margin-bottom: 24px;
}
.word-form,
.search-section {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  background: #fffefa;
}
.form-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.nested-group {
  margin-top: 16px;
}
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.actions {
  margin-top: 16px;
  display: flex;
  gap: 15px;
}
.search-item {
  padding: 10px 0;
  display: inline-block;
}
#searchWordsList {
  width: 90%;
  box-sizing: content-box;
}
.search-item {
  height: 10px;
  display: flex;
  align-items: center;
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
