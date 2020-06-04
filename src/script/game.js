class Game {
    constructor() {
        this.scale = 4;
        this.pix = { x: 2, y: 3 };
        this.bg = null;
        this.fg = null;
        this.ctxBg = null;
        this.ctxFg = null;
    }

    init(background, foreground, fileName) {
        this.bg = background;
        this.fg = foreground;
        this.ctxBg = background.getContext('2d');
        this.ctxFg = foreground.getContext('2d');
        this.loadMap(fileName).then((img) => {
            this.setupScreen(img.naturalWidth);
            this.render(img);
        });
    }

    loadMap(fileName) {
        return new Promise(resolve => {
            fetch(fileName)
            .then((response) => response.blob())
            .then((blob) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = URL.createObjectURL(blob);
            });
        })
    }

    setupScreen(imgWidth) {
        const ratio =  window.innerHeight / window.innerWidth;
        const width = Math.floor(imgWidth / 1);
        const height = Math.ceil(imgWidth / 1 * ratio);
        this.bg.width = width;
        this.bg.height = height;
        this.fg.width = width * this.scale;
        this.fg.height = height * this.scale;
    }

    render(img) {
        const scale = this.scale;
        const pix = this.pix;
        this.ctxBg.drawImage(img, 0, 0);
        // Trick to draw perfect pixel
        this.ctxFg.translate(-0.5, -0.5);
        this.ctxFg.scale(scale, scale);
        // Set thickness to 1 true px
        this.ctxFg.lineWidth = 1 / scale;
        this.ctxFg.strokeRect(pix.x, pix.y, 1.25, 1.25);
    }
}

export { Game };
