import { ref, computed } from "vue";
import type { definition, relationship } from "@components/EnglishNotebook/Types";

export type GlossaryFormState = {
  word?: string;
  pronunciation?: string;
  definitions?: definition;
  relationships?: relationship;
  examples?: string[];
  comments?: string[];
};

export function useGlossaryForm(initial: GlossaryFormState = {}) {
  const word = ref(initial.word ?? "");
  const pronunciation = ref(initial.pronunciation ?? "");
  const definitions = ref<definition>(initial.definitions && initial.definitions.length ? initial.definitions : [["", ""]]);
  const relationships = ref<relationship>(initial.relationships && initial.relationships.length ? initial.relationships : [{ label: "", word: "" }]);
  const examples = ref<string[]>(initial.examples && initial.examples.length ? initial.examples : [""]);
  const comments = ref<string[]>(initial.comments && initial.comments.length ? initial.comments : [""]);

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

  return {
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
    setForm,
  };
}
