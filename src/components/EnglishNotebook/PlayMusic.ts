export class PlayMusic {
    private static audios: Map<string, HTMLAudioElement> = new Map();
    private static url: string = new URL(import.meta.url).pathname.split("/").slice(0, -1).join("/") + "/music/";

    public static async play(url: string) {
        const fullUrl = this.url + url;
        if (this.audios.has(fullUrl)) {
            await this.audios.get(fullUrl)!.play();
        } else {
            let audio = new Audio(fullUrl);
            await audio.play();
            this.audios.set(fullUrl, audio);
        }
    }
}