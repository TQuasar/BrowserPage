export default class Paper {
    public static defaultDPI: number = 300;

    public static paperSizes = new Map<string, [number, number]>([
        ["A0", [84.1, 118.9]],
        ["A1", [59.4, 84.1]],
        ["A2", [42.0, 59.4]],
        ["A3", [29.7, 42.0]],
        ["A4", [21.0, 29.7]],
        ["A5", [14.8, 21.0]],
        ["A6", [10.5, 14.8]],
        ["A7", [7.4, 10.5]],
        ["A8", [5.2, 7.4]],
        ["A9", [3.7, 5.2]],
        ["A10", [2.6, 3.7]],

        ["B0", [100.0, 141.4]],
        ["B1", [70.7, 100.0]],
        ["B2", [50.0, 70.7]],
        ["B3", [35.3, 50.0]],
        ["B4", [25.0, 35.3]],
        ["B5", [17.6, 25.0]],
        ["B6", [12.5, 17.6]],
        ["B7", [8.8, 12.5]],
        ["B8", [6.2, 8.8]],
        ["B9", [4.4, 6.2]],
        ["B10", [3.1, 4.4]]
    ]);

    public static conversionSize(dpi: number, size: number) {
        return Math.round(size * dpi / 2.54);
    }

    public static fromCm(cm: number) {
        return Math.round(cm * this.defaultDPI / 2.54);
    }

    public static getPaperSize(paper: string) {
        const size = Paper.paperSizes.get(paper)
        if (size) {
            return {
                width: Paper.conversionSize(Paper.defaultDPI, size[0]),
                height: Paper.conversionSize(Paper.defaultDPI, size[1])
            };
        }
        return { width: 0, height: 0 };
    }
}

export class PaperSizeMap {
}