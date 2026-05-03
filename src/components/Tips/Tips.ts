import {reactive} from "vue";

type tipType = {
    type: "succeed" | "warn" | "debug" | "error" | "loading" | "info",
    text: string,
    time: number | null,
    end?: boolean,
}
class Tips {
    private static uuid = 0;
    public static tipList = reactive(<{[uuid: number]: tipType}>{});

    /**
     * The static method `addTip` add a tip to the tipList.
     * @param tip {tipType} The tip to add.
     */
    public static addTip(tip: tipType): number {
        const id: number = Tips.uuid++;
        tip.end = false;
        Tips.tipList[id] = tip;

        if (tip.time) {
            setTimeout(() => {
                Tips.tipList[id].end = true;
                setTimeout(() => Tips.deleteTip(id), 200)
            }, tip.time - 200)
        }
        return id;
    }

    public static deleteTip(id: number): void {
        delete Tips.tipList[id];
    }
}
export default Tips