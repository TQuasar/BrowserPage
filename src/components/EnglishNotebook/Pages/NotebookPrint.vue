<script setup lang="ts">
import {computed, defineProps, nextTick, onMounted, Ref, ref, shallowRef, ShallowRef, watch} from "vue";
import type {Page} from "@components/EnglishNotebook/Types";
import List from "@components/components/List.vue";
import Item from "@components/components/Item.vue";
import Switch from "@components/components/Switch.vue";
import Text from "@components/components/Text.vue";
import Button from "@components/components/Button.vue";
import Paper from "@components/EnglishNotebook/PaperSize";
import {Glossary} from "@components/EnglishNotebook/Glossary";
import CTX from "@components/EnglishNotebook/CTX";
import {BlobReader, BlobWriter, ZipWriter} from "@zip.js/zip.js";
import {AlignmentType, Document, Packer, Paragraph, TextRun} from "docx";

const props = defineProps<{ page: Page }>();
const word = props.page.content;

const paperSize = ref(Paper.getPaperSize("A4")!);

const printWays = ["zip(.png)", "zip(.jpeg)", "zip(.webp)", "json", "docx", "maidmap"];

const choice = ref(printWays[0]);
const choose = (item: string) => {
  choice.value = item;
};

const canvasList: Ref<number[]> = ref([]);
const canvasRef: HTMLCanvasElement[] = [];
const getCanvasRef = (el: Element, index: number) => {
  canvasRef[index] = <HTMLCanvasElement>el;
};

const printConfig = {
  title: Paper.fromCm(0.75),
  pad: Paper.fromCm(0.75),
  drawBorder: true,
  borderSize: Paper.fromCm(0.5)
};

async function preview(words: string[] = Array.from(Glossary.glossary.keys()), border: boolean = true) {
  try {
    const quality = 40;

    const {title, pad, drawBorder, borderSize} = printConfig;

    const gap = (paperSize.value.height - 2 * pad) / quality;
    canvasList.value = new Array(Math.ceil((words.length + Math.ceil(title / gap)) / quality));  /* 考虑到标题的存在，延长需要的纸张长度，将标题换算成单词 */

    await nextTick();  /* 等待DOM刷新后才能得到新的canvas引用 */

    canvasRef.forEach((canvas, index) => {
      const ctx: CTX = new CTX(canvas);
      /* 填充背景 */
      ctx.fillBackground("#fff");
      ctx.startLine("#808080", 3, 'square');
      if (drawBorder && border) {
        /* 绘制边框 */
        ctx.line(pad, pad + borderSize, pad, pad);
        ctx.goto(pad + borderSize, pad);
        ctx.line(pad, -pad - borderSize, pad, -pad);
        ctx.goto(pad + borderSize, -pad);
        ctx.line(-pad, pad + borderSize, -pad, pad);
        ctx.goto(-pad - borderSize, pad);
        ctx.line(-pad, -pad - borderSize, -pad, -pad);
        ctx.goto(-pad - borderSize, -pad);
        ctx.endLine();
      }

      let y = pad;
      if (index === 0) {
        ctx.fontSet(`bold ${title}px 微软雅黑`, "#000", "center", "top");
        ctx.font(ctx.width / 2, pad, "Vocabulary Notebook");
        y += title + Paper.fromCm(0.1);
      }
      ctx.fontSet(`${gap * 0.5}px 微软雅黑`, "#000", "left", "top");

      for (let i = index * quality; i < Math.min((index+1) * quality, words.length); i++) {
        let x = pad;
        const word = words[i];
        const info = Glossary.getEntry(word);

        x += ctx.font(x, y + gap * 0.05, word, "#000", `bold ${gap * 0.4}px 微软雅黑`).width;
        x += ctx.font(x, y + gap * 0.1, info!.p!, "#4a4a4a", `${gap * 0.3}px 微软雅黑`).width;
        x += Paper.fromCm(0.1);
        info!.d!.forEach(entry => {
          x += ctx.font(x, y + gap * 0.05, entry[0], "#000000", `${gap * 0.4}px 微软雅黑`).width;
          x += ctx.font(x, y + gap * 0.1, entry[1], "#434343", `${gap * 0.3}px 微软雅黑`).width;
          x += Paper.fromCm(0.1);
        });

        y += gap;
      }
    });
  } catch (e) {

  }
}

function getBlob(canvas: HTMLCanvasElement, type: string = 'png'): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => resolve(blob), `image/${type}`);
  });
}
function download(name: string, blob: Blob) {
  const link = document.createElement("a");
  link.download = name;
  link.href = URL.createObjectURL(blob);
  link.click();
}

const downLoads = {
  downLoad: async () => {
    const way = choice.value;
    way === "zip(.png)" ? await downLoads.zipImg("png") :
        way === "zip(.jpg)" ? await downLoads.zipImg("jpg") :
            way === "zip(.webp)" ? await downLoads.zipImg("webp") :
                way === "json" ? await downLoads.json() :
                    way === "docx" ? await downLoads.docx() : undefined;
  },
  zipImg: async (type: string = 'png') => {
    await preview(undefined, false);
    const blobWriter = new BlobWriter();
    const zipWriter = new ZipWriter(blobWriter);

    let page = 1;
    for (const el of canvasRef) {
      await zipWriter.add(`page-${page}.${type}`, new BlobReader(<Blob>await getBlob(el, type)));
      page++;
    }

    const zipBlob = await zipWriter.close();
    download("vocabulary.zip", zipBlob);
  },
  json: async () => {
    download("vocabulary.json", new Blob([
        JSON.stringify(
            Array.from(Glossary.glossary.values()).map(word => ({
              "word": word.w,
              "definition": word.d,
              "pronunciation": word.p,
              "relationship": word.r,
              "examples": word.e,
              "comment": word.c,
              "type": word.t
            }))
        )
    ], { type: 'application/json;charset=utf-8' }));
  },
  docx: async () => {
    const docx = new Document({
      sections: [{children: (() => {
        const paragraphs: Paragraph[] = [
            new Paragraph({alignment: AlignmentType.CENTER, children: [new TextRun({text: "Vocabulary Notebook", size: 48, bold: true, })]})
        ];

        Array.from(Glossary.glossary.values()).forEach(info => {
          const word = new TextRun({text: info.w, size: 24, bold: true});
          const pronunciation = new TextRun({text: info.p, color: "#4a4a4a", size: 16});
          const definition = (info.d.map(definition => [
            new TextRun({text: definition[0], size: 20}),
            new TextRun({text: definition[1], color: "#434343", size: 18})
          ])).flat();
          const example = new TextRun({text: info.e.join("; "), size: 18, color: "#191919", italics: true});

          paragraphs.push(new Paragraph({
            children: [
              word,
              pronunciation,
              ...definition,
              example
            ]
          }));
        });

        return paragraphs;
      })()
    }]
    });
    Packer.toBlob(docx).then(blob => {
      download("vocabulary.docx", blob);
    });
  }
} as const;

</script>

<template>
<div>
  <section v-if="word.length">
    <h1>Print {{ word }}</h1><hr>
  </section>
  <section v-else>
    <h1>Print All</h1><hr>
    <p>Please choose the way to print words that you like: </p>
    <List :items="printWays" v-slot="item" order="no">
      <Item>
        <Switch :model-value="item.item == choice" @click="choose(item.item)"></Switch>
        <Text :text="item.item"/>

      </Item>
    </List>

    <Button type="primary" style="margin-left: 15px" size="large" plain @click="preview()">Preview</Button>
    <Button type="primary" style="margin-left: 15px" size="large" plain @click="downLoads.downLoad()">Download</Button>
    <hr>
    <section id="canvases">
      <canvas
        v-for="(item, index) in canvasList"
        :key="index"
        :ref="el => getCanvasRef(<Element>el, index)"
        :width="paperSize.width"
        :height="paperSize.height"
        :style="{
          width: '80%',
          aspectRatio: paperSize.width / paperSize.height
        }"
        class="printCanvas"
      />
    </section>
  </section>
</div>
</template>

<style scoped>
.printCanvas {
  display: block;
  position: relative;
  border-radius: 10px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #7bba7e;
}
</style>