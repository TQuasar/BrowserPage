class CTX {
    private readonly canvas: HTMLCanvasElement;
    public readonly height: number;
    public readonly width: number;
    private readonly ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.height = canvas.height;
        this.width = canvas.width;
    }

    private computePosX(x: number) {
        if (x < 0) {
            return this.width + x;
        }
        return x;
    }

    private computePosY(y: number) {
        if (y < 0) {
            return this.height + y;
        }
        return y;
    }

    startLine(style: string, width: number, cap: "square" | "round" | "butt") {
        this.ctx.beginPath();
        this.ctx.strokeStyle = style;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = cap;
    }

    endLine() {
        this.ctx.stroke();
    }

    line(x0: number, y0: number, x1: number, y1: number) {
        this.ctx.moveTo(this.computePosX(x0), this.computePosY(y0));
        this.goto(x1, y1);
    }

    goto(x: number, y: number) {
        this.ctx.lineTo(this.computePosX(x), this.computePosY(y));
    }

    fillBackground(color: string) {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    fontSet(config: string, fillStyle: string, align: CanvasTextAlign, baseLine: CanvasTextBaseline) {
        this.ctx.font = config;
        this.ctx.textAlign = align;
        this.ctx.fillStyle = fillStyle;
        this.ctx.textBaseline = baseLine;
    }

    font(x: number, y: number, text: string, fillStyle?: string, font?: string) {
        if (fillStyle) this.ctx.fillStyle = fillStyle;
        if (font) this.ctx.font = font;

        this.ctx.fillText(text, this.computePosX(x), this.computePosY(y));
        return this.ctx.measureText(text);
    }
}

export default CTX;