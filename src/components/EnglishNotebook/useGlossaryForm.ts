import {ref, computed, Ref} from "vue";
import type { definition, relationship } from "@components/EnglishNotebook/Types";
import {Glossary} from "@components/EnglishNotebook/Glossary";

export type GlossaryFormState = {
  word?: string;
  pronunciation?: string;
  definitions?: definition;
  relationships?: relationship;
  examples?: string[];
  comments?: string[];
  typeLevel?: number;
};

export function useGlossaryForm(useWord: string = "") {
  const wordInfo = Glossary.getEntry(useWord);
  const word = ref(wordInfo?.w ?? "");
  const pronunciation = ref(wordInfo?.p ?? "");
  const definitions = ref<definition>(wordInfo?.d && wordInfo?.d.length ? wordInfo?.d : [["", ""]]);
  const relationships = ref<relationship>(wordInfo?.r && wordInfo?.r.length ? wordInfo?.r : [{ label: "", word: "" }]);
  const examples = ref<string[]>(wordInfo?.e && wordInfo?.e.length ? wordInfo?.e : [""]);
  const comments = ref<string[]>(wordInfo?.c && wordInfo?.c.length ? wordInfo?.c : [""]);
  const typeLevel: Ref<number> = ref<number>(wordInfo?.t ?? 10);

  const normalizedDefinitions = computed(() => {
    return definitions.value
      .map((item) => [item[0].trim(), item[1].trim()] as [string, string])
      .filter(([partOfSpeech, translation]) => partOfSpeech && translation);
  });

  const normalizedRelationships = computed(() => {
    return relationships.value
      .map((item) => ({ label: item.label.trim(), word: item.word.trim() }))
      .filter((item) => item.label && item.word);
  });

  const normalizedExamples = computed(() => examples.value.map((item) => item.trim()).filter((item) => item));
  const normalizedComments = computed(() => comments.value.map((item) => item.trim()).filter((item) => item));

  const resetForm = () => {
    word.value = "";
    pronunciation.value = "";
    definitions.value = [["", ""]];
    relationships.value = [{ label: "", word: "" }];
    examples.value = [""];
    comments.value = [""];
    typeLevel.value = 1;
  };

  const setForm = (state: GlossaryFormState) => {
    word.value = state.word ?? "";
    pronunciation.value = state.pronunciation ?? "";
    definitions.value = state.definitions && state.definitions.length ? state.definitions : [["", ""]];
    relationships.value = state.relationships && state.relationships.length ? state.relationships : [{ label: "", word: "" }];
    examples.value = state.examples && state.examples.length ? state.examples : [""];
    comments.value = state.comments && state.comments.length ? state.comments : [""];
  };

  const addDefinition = () => definitions.value.push(["", ""]);
  const removeDefinition = (index: number) => {
    if (definitions.value.length > 1) definitions.value.splice(index, 1);
  };

  const addRelationship = () => relationships.value.push({ label: "", word: "" });
  const removeRelationship = (index: number) => {
    if (relationships.value.length > 1) relationships.value.splice(index, 1);
  };

  const addExample = () => examples.value.push("");
  const removeExample = (index: number) => {
    if (examples.value.length > 1) examples.value.splice(index, 1);
  };

  const addComment = () => comments.value.push("");
  const removeComment = (index: number) => {
    if (comments.value.length > 1) comments.value.splice(index, 1);
  };

  const changeLevelType = (plus: number) => {
    typeLevel.value += plus;
    typeLevel.value = Math.min(Math.max(1, typeLevel.value), 10);
  }

  return {
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
    resetForm,
    setForm,
    changeLevelType
  };
}
