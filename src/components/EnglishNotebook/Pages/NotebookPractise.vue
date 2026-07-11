<script setup lang="ts">
import {Glossary} from "@components/EnglishNotebook/Glossary";
import {PlayMusic} from "@components/EnglishNotebook/PlayMusic";
import Button from "@components/components/Button.vue";
import {computed, inject, Ref, ref} from "vue";
import {definition, glossaryType} from "@components/EnglishNotebook/Types";
import List from "@components/components/List.vue";
import Item from "@components/components/Item.vue";
import Checkbox from "@components/components/Checkbox.vue";
import Text from "@components/components/Text.vue";
import Tips from "@components/Tips/Tips";
import Input from "@components/components/Input.vue";
import ReadWords from "@components/EnglishNotebook/ReadWords";
import readWords from "@components/EnglishNotebook/ReadWords";

const targetWords = computed(() => Array.from(Glossary.glossary.values()).filter(w => w.t > 1));

let practiseStatus: Ref<string> = ref("prepare");
const goHome = <()=>void>inject("goHome");
class Practise {
  private readonly wordsList: glossaryType[] = [];
  private questions: {type: string, shows: string[], answer: string, word: string}[] = [];

  private anyItem<T>(value: T[]): T {
    return value[Math.random() * value.length >> 0];
  }

  private disrupt<T>(...values: T[]) {
    return values.sort((a, b) => Math.random() - 0.5);
  }

  private randomCn(partOfSpeech: string, index: number = 0): string {
    const definition = this.anyItem(this.wordsList).d;

    if (index>100) {
      const translate = this.anyItem(definition);
      return `${translate[0]} ${translate[1]}`;
    }

    for (const [current, translate] of definition) {
      if (current === partOfSpeech) {
        return `${current} ${translate}`;
      }
    }

    return this.randomCn(partOfSpeech, index+1);
  }

  private randomEn() {
    return this.anyItem(this.wordsList).w;
  }

  private randomPronunciation() {
    return this.anyItem(this.wordsList).p;
  }

  private randomTranslate() {
    return this.getTranslate(Glossary.getEntry(this.randomEn())?.d ?? []);
  }

  private getTranslate(word: definition) {
    return word.map(m => `${m[0]} ${m[1]}`).join(";")
  }

  private choiceFactory(word: glossaryType, correct: string, show: string, type: string, fn: ()=>string) {
    const answers: string[] = [correct];
    const bindFn = fn.bind(this);

    while (answers.length < 8) {
      const target = bindFn();
      if (target !== correct && !answers.includes(target)) {
        answers.push(target);
      }
    }

    const q = this.disrupt(...answers);
    return {type: type, shows: [show, ...q], answer: correct, word: word.w};
  }

  private makeQuestion(word: glossaryType) {
    switch (word.t) {
      case 10: {
        /* 看英文选中文 */
        const definition = this.anyItem(word.d);
        return this.choiceFactory(word, definition.join(" "), word.w, "choose-cn", this.randomCn.bind(this, definition[0]));
      }
      case 9: {
        return this.choiceFactory(word, word.w, this.getTranslate(word.d), "choose-en", this.randomEn);
      }
      case 8: {
        return this.choiceFactory(word, word.p, this.getTranslate(word.d), "choose-pronunciation", this.randomPronunciation);
      }
      case 7: {
        const correct = this.getTranslate(word.d);
        return {type: "writeEn-cn", shows: [correct], answer: word.w, word: word.w};
      }
      case 6: {
        return {type: "writeEn-pronunciation", shows: [word.p], answer: word.w, word: word.w};
      }
      case 5: {
        return this.choiceFactory(word, word.w, this.getTranslate(word.d), "listenChoose-en", this.randomEn);
      }
      case 4: {
        /* 听音选中文 */
        const definition = this.anyItem(word.d);
        return this.choiceFactory(word, definition.join(" "), word.w, "listenChoose-cn", this.randomCn.bind(this, definition[0]));
      }
      case 3: {
        return this.choiceFactory(word, word.p, this.getTranslate(word.d), "listenChoose-pronunciation", this.randomPronunciation);
      }
      case 2: {
        const correct = this.getTranslate(word.d);
        return {type: "listenWriteEn-pronunciation", shows: [correct], answer: word.w, word: word.w};
      }
      case 1: {
        /* 读音频，写下词性、释义以及拼写 */
        return {type: "listen-comprehensive", shows: [], answer: "", word: word.w};
      }
    }
  }

  public nextQuestion() {
    this.thisQuestion = this.questions[this.index++];

    if (this.thisQuestion.type.includes("listen")) {
      readWords.read(this.thisQuestion.word);
    }

    console.log(this.thisQuestion);
    if (this.index === this.questions.length) {
      this.done = true;
    }
  }

  public uploadAnswer(answer: string) {
    if (this.thisQuestion.type === "listen-comprehensive") {
      /* 综合题另算 */

    } else {
      return answer.toLowerCase() === this.thisQuestion.answer.toLowerCase();
    }
  }

  constructor(wordList: glossaryType[]) {
    this.wordsList = this.disrupt(...wordList);
    for (const word of this.wordsList) {
      this.questions.push(this.makeQuestion(word)!);
    }
    this.nextQuestion();
    //console.log(this.questions);
  }

  private index = 0;
  private done = false;
  private thisQuestion: {type: string, shows: string[], answer: string, word: string} = {
    type: "",
    shows: [],
    answer: "",
    word: ""
  };

  public isDone() {
    return this.done;
  }

  public question() {
    return this.thisQuestion;
  }

  public process() {
    return this.index;
  }

  public size() {
    return this.wordsList.length;
  }
}

const questions: Ref<Practise | undefined> = ref();

const currentQuestion = computed(() => questions.value?.question() ?? {type: "", shows: [], answer: "", word: ""});

const theAnswer = ref("");
const searchList = ref([]);
const uploadStatues = ref("non");

const allQuestions = ref(0);
const correctQuestions = ref(0);
const wrongQuestions = ref(0);
const startTime = ref(0);
const usingTime = ref(0);
const accuracyRate = ref("");
const answerQuality = ref("");

function playPronunciation(word: string) {
  ReadWords.read(word);
}

const allTime = ref(formatWithDate(Date.now() - startTime.value));
let timer: NodeJS.Timeout;

function formatWithDate(ms: number) {
  const date = new Date(ms);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function startPractise() {
  startTime.value = Date.now();
  practiseStatus.value = 'start';
  questions.value = new Practise(targetWords.value);
  allQuestions.value = questions.value.size();
  timer = setInterval(() => allTime.value = formatWithDate(Date.now() - startTime.value), 200);
}

function giveAnswer(answer: string) {
  if (uploadStatues.value === "non") {
    theAnswer.value = answer;
  }
}

function nextQuestion() {
  if (questions.value!.isDone()) {
    practiseStatus.value = "settlement";
    clearInterval(timer);

    usingTime.value = Date.now() - startTime.value;
    accuracyRate.value = (correctQuestions.value * 100 / allQuestions.value).toFixed(2);
    answerQuality.value = ((usingTime.value / 1000) / correctQuestions.value).toFixed(2);
  } else {
    questions.value!.nextQuestion();
    uploadStatues.value = "non";
  }
  theAnswer.value = "";
}

function uploadAnswer() {
  if (uploadStatues.value === "non" && theAnswer.value) {
    uploadStatues.value = "holding";

    if (questions.value?.uploadAnswer(theAnswer.value)) {
      Glossary.changeTypeLevel(currentQuestion.value.word, -1);
      PlayMusic.play("correct.wav");
      Tips.addTip({type: "succeed", text: "答对啦👍", time: 1000});

      correctQuestions.value++;
      setTimeout(() => nextQuestion(), 600);
    } else {
      theAnswer.value = currentQuestion.value.answer;
      Glossary.changeTypeLevel(currentQuestion.value.word, 1);
      PlayMusic.play("wrong.wav");
      Tips.addTip({type: "succeed", text: "答错啦😢", time: 1000});

      wrongQuestions.value++;
      uploadStatues.value = "wrong";
    }
  }
}
</script>

<template>
<div>
  <div v-if="practiseStatus === 'prepare'">
    <h1>Practise makes perfect!</h1>
    <p>You have to answer {{ targetWords.length }} question(s) today.</p>
    <Button type="success" plain size="large" @click="startPractise()">I am ready</Button>
  </div>

  <div class="questionsBox" v-else-if="practiseStatus === 'start'">
    <div id="stateBar">
      <div>
        <img width="14px" height="14px" src="../practise/question.svg" alt="Questions:">
        <span>{{ `${questions!.process()} / ${allQuestions}`  }}</span>
      </div>
      <div>
        <img width="14px" height="14px" src="../practise/correct.svg" alt="Correct:">
        <span>{{ correctQuestions  }}</span>
      </div>
      <div>
        <img width="14px" height="14px" src="../practise/wrong.svg" alt="Wrong:">
        <span>{{ wrongQuestions }}</span>
      </div>
      <div>
        <img width="14px" height="14px" src="../practise/time.svg" alt="Time:">
        <span>{{ allTime }}</span>
      </div>
    </div>

    <section class="question" v-if="currentQuestion.type === 'choose-cn' || currentQuestion.type === 'choose-en' || currentQuestion.type === 'choose-pronunciation'">
      <Text tag="h1" text="Select matching options" user-select="none" margin="5px" />
      <Text tag="h4" :text="currentQuestion.shows[0]" user-select="none" margin="5px"/>

        <Item
            v-for="(item, index) in currentQuestion.shows.slice(1)"
            :key="index"
            @click="giveAnswer(item)"
            gap="8px"
            style="padding: 2px;height: 80%;width: 90%;font-size: 14px"
        >
          <Checkbox :model-value="theAnswer === item"></Checkbox>
          <span>{{ item }}</span>
        </Item>
    </section>

    <section class="question" v-else-if="currentQuestion.type === 'writeEn-cn' || currentQuestion.type === 'writeEn-pronunciation'">
      <Text tag="h1" text="Write the matching word" user-select="none" margin="5px"/>
      <Text tag="h4" :text="currentQuestion.shows[0]" user-select="none" margin="5px" />

      <span style="user-select: none">{{ currentQuestion.word[0] + "_".repeat(currentQuestion.word.length-1) }}</span>

      <Input placeholder="Fill in the word." style="margin-bottom: 20px;" :model-value="theAnswer" @input="value => giveAnswer(String(value))" />
    </section>

    <section class="question" v-else-if="currentQuestion.type === 'listenChoose-cn' || currentQuestion.type === 'listenChoose-en' || currentQuestion.type === 'listenChoose-pronunciation'">
      <Text tag="h1" text="Select matching options" user-select="none" margin="5px" />
      <Button style="margin-bottom: 20px;" type="primary" size="small" @click="playPronunciation(currentQuestion.word)">Play pronunciation</Button>
      <span v-if="uploadStatues === 'wrong'">{{ Glossary.getEntry(currentQuestion.word)?.p }}</span>

      <Item
          v-for="(item, index) in currentQuestion.shows.slice(1)"
          :key="index"
          @click="giveAnswer(item)"
          gap="8px"
          style="padding: 2px;height: 80%;width: 90%;font-size: 14px"
      >
        <Checkbox :model-value="theAnswer === item"></Checkbox>
        <span>{{ item }}</span>
      </Item>
    </section>

    <section class="question" v-else-if="currentQuestion.type === 'listenWriteEn-pronunciation'">
      <Text tag="h1" text="Write the matching word" user-select="none" margin="5px"/>
      <Button style="margin-bottom: 20px;" type="primary" size="small" @click="playPronunciation(currentQuestion.word)">Play pronunciation</Button>

      <span style="user-select: none">{{ currentQuestion.word[0] + "_".repeat(currentQuestion.word.length-1) }}</span>

      <span v-if="uploadStatues === 'wrong'">{{ Glossary.getEntry(currentQuestion.word)?.p }}</span>

      <Input placeholder="Fill in the word." style="margin-bottom: 20px;" :model-value="theAnswer" @input="value => giveAnswer(String(value))" />
    </section>

    <section class="question" v-else-if="currentQuestion.type === 'listen-comprehensive'">
      <Text tag="h1" text="Write the matching information" user-select="none" margin="5px"/>
      <Button style="margin-bottom: 20px;" type="primary" size="small" @click="playPronunciation(currentQuestion.word)">Play pronunciation</Button>

      <Input model-value="" placeholder="Spell the word..." style="margin-bottom: 20px;" />
      <Input model-value="" placeholder="Choose the translation..." />
      <List v-if="searchList.length" :items="searchList" order="no" v-slot="{ item }" id="searchWordsList">
        <div class="search-item">
          <span class="word-partOfSpeech">{{ Glossary.getEntry(item)?.d.map(d => d[0]).join('/ ') }}</span>
          <span class="word-spell">{{ item }}</span>
        </div>
      </List>
    </section>

    <Button v-if="uploadStatues === 'non'" size="large" plain :type="theAnswer.length ? 'success' : 'info'" @click="uploadAnswer()">I'm sure!</Button>
    <Button v-if="uploadStatues === 'wrong'" size="large" plain type="primary" @click="nextQuestion()">Next</Button>
  </div>

  <div v-else-if="practiseStatus === 'settlement'">
    <h1>You passed the practise with a time of <strong>{{ allTime }}!</strong></h1>
    <p>There is your practise report:</p>
    <p>You answered total of <strong>{{ allQuestions }}</strong> questions, </p>
    <p>of witch <strong>{{ correctQuestions }}</strong> {{ (correctQuestions > 1 ? 'were' : 'was') }} correct</p>
    <p>and <strong>{{ wrongQuestions }}</strong> {{ (correctQuestions > 1 ? 'were' : 'was') }} incorrect.</p>
    <p>Your accuracy rate is <strong>{{ accuracyRate }}%</strong>.</p>

    <p>Your average completion time was: <strong>{{ (usingTime / allQuestions / 1000).toFixed(2) }}s</strong>.</p>
    <p>You answer one question every <strong>{{ answerQuality }}s</strong> seconds on average.</p>

    <p v-if="(correctQuestions * 100 / allQuestions) >= 90">That is an amazing grade! Keep up the good work!</p>
    <p v-else-if="(correctQuestions * 100 / allQuestions) >= 75">Good job! There's still room for improvement though.</p>
    <p v-else>Keep practicing, you can do better next time!</p>

    <Button size="medium" plain type="primary" @click="goHome()">Home</Button>
  </div>
</div>
</template>

<style scoped>
#stateBar {
  position: fixed;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  justify-content: center;
  font-size: 13px;
  border-radius: 5px;
  right: 0;
  top: 0;
  width: 25px;
  height: 100%;
  padding: 5px;
  z-index: 100;
  background-color: #f6e7b1;
  gap: 10%;
}
#stateBar > * {
  display: flex;
  flex-direction: column;
  word-break: break-all;
}

.question {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>