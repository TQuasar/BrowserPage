<script setup lang="ts">
import {defineProps, ref, computed, inject, watch} from "vue";
import { Glossary } from "@components/EnglishNotebook/Glossary";
import Input from "@components/components/Input.vue";
import Button from "@components/components/Button.vue";
import Tips from "@components/Tips/Tips";
import ReadWords from "@components/EnglishNotebook/ReadWords";
import { useGlossaryForm, type GlossaryFormState } from "@components/EnglishNotebook/useGlossaryForm";
import type {Page, autocomplete} from "@components/EnglishNotebook/Types";

const props = defineProps<{ page: Page }>();

const {
    word,
    pronunciation,
    definitions,
    relationships,
    examples,
    comments,
    typeLevel,
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
    setForm,
    changeLevelType
} = useGlossaryForm(props.page.content);

const entryNotFound = ref(false);
const editMode = ref(false);
const originalForm = ref<GlossaryFormState | null>(null);

const goHome = inject<() => void>("goHome");
const openWordPage = inject("openWordPage");

const hasPreview = computed(() => !entryNotFound.value && !editMode.value);

const loadEntry = () => {
  const wordText = props.page.content.trim();
  const entry = Glossary.getEntry(wordText);
  if (!entry) {
    entryNotFound.value = true;
    editMode.value = true;
    setForm({
      word: wordText,
      pronunciation: "",
      definitions: [["", ""]],
      relationships: [],
      examples: [],
      comments: [],
    });
    return;
  }

  entryNotFound.value = false;
  editMode.value = false;
  const loadedForm: GlossaryFormState = <GlossaryFormState>{
    word: entry.w,
    pronunciation: entry.p ?? "",
    definitions: entry.d.length ? entry.d : [["", ""]],
    relationships: Array.isArray(entry.r) ? entry.r.map((item: any) => ({ label: item.label || "", word: item.word || "" })) : [],
    examples: Array.isArray(entry.e) ? entry.e.slice() : [],
    comments: Array.isArray(entry.c) ? entry.c.slice() : [],
  };
  setForm(loadedForm);
  originalForm.value = loadedForm;
};

const saveEntry = () => {
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
    typeLevel.value
  );

  const savedForm = {
    word: trimmedWord,
    pronunciation: pronunciation.value.trim(),
    definitions: normalizedDefinitions.value,
    relationships: normalizedRelationships.value,
    examples: normalizedExamples.value,
    comments: normalizedComments.value,
  };
  originalForm.value = savedForm;
  entryNotFound.value = false;
  editMode.value = false;
  setForm(savedForm);
};

const toggleEditMode = () => {
  if (!entryNotFound.value && originalForm.value) {
    setForm(originalForm.value);
  }
  editMode.value = true;
};

const playPronunciation = () => ReadWords.read(word.value);

const openPrint = <(word: string)=>void>inject("print");

const autocomplete = (<autocomplete>inject("autocompleteWords")).bind(null, word, pronunciation, definitions, relationships, examples);

const cancelEdit = () => {
  if (originalForm.value) {
    setForm(originalForm.value);
  }
  if (!entryNotFound.value) {
    editMode.value = false;
  } else {
    setForm({
      word: props.page.content.trim(),
      pronunciation: "",
      definitions: [["", ""]],
      relationships: [],
      examples: [],
      comments: [],
    });
  }
};

watch(() => props.page.content, loadEntry, { immediate: true });

const moodsIcon = <string[]>inject("moodsIcon");
</script>

<template>
  <div class="word-page">
    <div class="page-header">
      <div class="title-row">
        <div>
          <!-- Title -->
          <div style="display: flex;flex-direction: row;gap: 5px;align-items: center;">
            <h2>{{ word }}</h2>
            <img style="pointer-events: none;" :src="moodsIcon[typeLevel-1]" alt="图片" width="24" height="24" >
            <Button type="success" size="smaller" plain @click="changeLevelType(-1);saveEntry()">upgrade</Button>
            <Button type="danger" size="smaller" plain @click="changeLevelType(1);saveEntry()">downgrade</Button>
          </div>
          <p class="subtitle">{{ entryNotFound ? "The current entry was not found. You can fill it out and save it." : "Details of words read from the vocabulary book." }}</p>
        </div>
        <div class="header-actions">
          <Button type="primary" size="small" @click="playPronunciation">Play pronunciation</Button>
          <Button type="default" size="small" @click="goHome?.()">Return Home</Button>
          <Button v-if="hasPreview" type="default" size="small" @click="toggleEditMode">Edit</Button>
          <Button type="default" size="small" @click="openPrint(word)">print</Button>
        </div>
      </div>
    </div>

    <div class="page-expand">
      <!-- 预览模式 -->
      <section class="preview-block" v-if="hasPreview">
        <div class="preview-metadata">
          <div class="preview-item">
            <span class="meta-title">Pronunciation</span>
            <span>{{ pronunciation || "—" }}</span>
          </div>
          <div class="preview-item">
            <span class="meta-title">Definitions</span>
            <span>{{ normalizedDefinitions.length }}</span>
          </div>
          <div class="preview-item">
            <span class="meta-title">Examples</span>
            <span>{{ normalizedExamples.length }}</span>
          </div>
        </div>

        <section class="section-block compact">
          <h3>Definitions</h3>
          <div v-if="normalizedDefinitions.length === 0" class="empty-state">No definitions</div>
          <div v-for="([partOfSpeech, translation], index) in normalizedDefinitions" :key="index" class="preview-row">
            <span>{{ partOfSpeech }}</span>
            <span>{{ translation }}</span>
          </div>
        </section>

        <section class="section-block compact">
          <h3>Relationships</h3>
          <div v-if="normalizedRelationships.length === 0" class="empty-state">No related words</div>
          <div v-for="(relation, index) in normalizedRelationships" :key="index" class="preview-row">
            <span>{{ relation.label }}</span>
            <span>{{ relation.word }}</span>
            <Button type="primary" style="margin-left: 15px" size="smaller" plain @click="() => openWordPage(relation.word)">Go To</Button>
          </div>
        </section>

        <section class="section-block compact">
          <h3>Examples</h3>
          <div v-if="normalizedExamples.length === 0" class="empty-state">No examples</div>
          <div v-for="(example, index) in normalizedExamples" :key="index" class="preview-row">
            <span>{{ example }}</span>
          </div>
        </section>

        <section class="section-block compact">
          <h3>Comments</h3>
          <div v-if="normalizedComments.length === 0" class="empty-state">No comments</div>
          <div v-for="(comment, index) in normalizedComments" :key="index" class="preview-row">
            <span>{{ comment }}</span>
          </div>
        </section>

        <div class="actions-row">
          <Button type="primary" @click="toggleEditMode">Edit</Button>
          <Button type="primary" @click="playPronunciation">Play pronunciation</Button>
        </div>
      </section>
      <!-- 编辑模式 -->
      <div class="page-content" v-else>
        <div class="meta-row">
          <div class="meta-item">
            <span class="meta-title">Pronunciation</span>
            <span>{{ pronunciation || "—" }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-title">Number of Definitions</span>
            <span>{{ definitions.length }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-title">Example sentences</span>
            <span>{{ examples.filter(item => item.trim()).length }}</span>
          </div>
        </div>

        <section class="section-block">
          <h3>Pronunciation</h3>
          <div class="form-row">
            <Input v-model="pronunciation" placeholder="Pronunciation" width="40%" />
          </div>
        </section>

        <section class="section-block">
          <h3>Definitions</h3>
          <div v-for="(item, index) in definitions" :key="index" class="form-row">
            <Input v-model="item[0]" placeholder="part of speech (e.g. n., v,)" width="20%" />
            <Input v-model="item[1]" placeholder="translation" width="60%" />
            <Button type="danger" size="smaller" plain @click="() => removeDefinition(index)">Remove</Button>
          </div>
          <Button type="success" size="small" @click="addDefinition">Add Definition</Button>
        </section>

        <section class="section-block">
          <h3>Relationships</h3>
          <div v-if="relationships.length === 0" class="empty-state">No related words</div>
          <div v-for="(item, index) in relationships" :key="index" class="form-row">
            <Input v-model="item.label" placeholder="relationship (e.g. pl.)" width="20%" />
            <Input v-model="item.word" placeholder="related words" width="60%" />
            <Button type="danger" size="smaller" plain @click="() => removeRelationship(index)">Remove</Button>
          </div>
          <Button type="success" size="small" @click="addRelationship">Add Relationship</Button>
        </section>

        <section class="section-block">
          <h3>Examples</h3>
          <div v-if="examples.length === 0" class="empty-state">No examples</div>
          <div v-for="(example, index) in examples" :key="index" class="form-row">
            <Input v-model="examples[index]" placeholder="example sentences" width="80%" />
            <Button type="danger" size="smaller" plain @click="() => removeExample(index)">Remove</Button>
          </div>
          <Button type="success" size="small" @click="addExample">Add Example</Button>
        </section>

        <section class="section-block">
          <h3>Comments</h3>
          <div v-if="comments.length === 0" class="empty-state">No comments</div>
          <div v-for="(comment, index) in comments" :key="index" class="form-row">
            <Input v-model="comments[index]" placeholder="comments" width="80%" />
            <Button type="danger" size="smaller" plain @click="() => removeComment(index)">Remove</Button>
          </div>
          <Button type="success" size="small" @click="addComment">Add Comment</Button>
        </section>

        <div class="actions-row">
          <Button type="default" @click="cancelEdit">Cancel</Button>
          <Button type="primary" @click="saveEntry">Save Word</Button>
          <Button type="primary" @click="autocomplete">Autocomplete</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.word-page {
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d8d0b0;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.title-row h2 {
  margin: 0;
  font-size: 24px;
  color: #3b3a34;
}

.subtitle {
  margin: 6px 0 0;
  color: #7a7464;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-expand {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.preview-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-metadata {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.preview-row {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px dashed #e0d8c1;
}

.preview-row:last-child {
  border-bottom: none;
}

.preview-item {
  background: #fff;
  border: 1px solid #ded1b3;
  border-radius: 8px;
  padding: 10px 12px;
  min-width: 0;
}

.preview-block .preview-row:last-child {
  border-bottom: none;
}

.section-block.compact {
  padding: 12px;
}

.meta-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  background: #fff;
  border: 1px solid #ded1b3;
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 160px;
}

.meta-title {
  display: block;
  color: #7a7464;
  margin-bottom: 6px;
}

.section-block {
  background: #fff;
  border: 1px solid #ded1b3;
  border-radius: 10px;
  padding: 16px;
}

.section-block h3 {
  margin: 0 0 12px;
  color: #3b3a34;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.empty-state {
  color: #7a7464;
  padding: 10px 0;
}

.actions-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-text {
  color: #7a7464;
}
</style>
