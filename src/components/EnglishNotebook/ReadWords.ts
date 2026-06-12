import Tips from "@components/Tips/Tips";

class ReadWords {
    static div = document.createElement('div');
    static mapping: Map<string, HTMLAudioElement> = new Map();
    static speeches: Map<string, SpeechSynthesisUtterance> = new Map();
    static {
        document.body.append(ReadWords.div);
    }
    static support: boolean = 'speechSynthesis' in window;

    static read(word: string) {
        try {
            /* 加载缓存在DOM的audio */
            const audio: HTMLAudioElement = ReadWords.mapping.get(word)!;
            audio.play().catch(e => {
                throw e;
            });
        } catch (e) {
            try {
                /* 无缓存尝试获取 */
                const audio = document.createElement('audio');
                audio.src = `https://dict.youdao.com/dictvoice?audio=${word}&type=2`;
                ReadWords.mapping.set(word, audio);
                ReadWords.div.appendChild(audio);
                audio.play().catch(e => {
                    throw e;
                })
            } catch (e) {
                /* 不在词库中的单词 */
                if (ReadWords.support) {
                    /* 支持朗读 */
                    let speech;
                    if (ReadWords.speeches.has(word)) {
                        speech = ReadWords.speeches.get(word)!;
                    } else {
                        speech = new SpeechSynthesisUtterance(word);
                        speech.lang = "en-US";
                        ReadWords.speeches.set(word, speech);
                    }
                    window.speechSynthesis.speak(speech);
                } else {
                    Tips.addTip({type: "warn", text: "Playback failed", time: 1500});
                }
            }
        }
    }
}

export default ReadWords;