class Game {
    constructor() {
        this.scale = 4;
        this.screenScale = null;
        this.pix = { x: 2, y: 3 };
        this.bg = null;
        this.fg = null;
        this.ctxBg = null;
        this.ctxFg = null;
        this.samePixelsPos = [];
        this.virus = [[5, 1]];
    }

    init(background, foreground, fileName) {
        this.bg = background;
        this.fg = foreground;
        this.ctxBg = background.getContext('2d');
        this.ctxFg = foreground.getContext('2d');
        this.loadMap(fileName).then((img) => {
            this.img = img;
            this.setupScreen();
            this.animate();
            setInterval(this.renderVirus.bind(this), 100);
            setInterval(this.propagateVirus.bind(this), 2000);
            window.addEventListener('resize', this.setupScreen.bind(this));
            document.addEventListener('keydown', this.onKeyDown.bind(this));
            document.addEventListener('click', this.onClick.bind(this));
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

    setupScreen() {
        const [width, height] = this.getImageSize();
        this.bg.width = width;
        this.bg.height = height;
        this.fg.width = width * this.scale;
        this.fg.height = height * this.scale;

        this.ctxBg.drawImage(this.img, 0, 0);
        this.screenScale = window.innerWidth / this.img.naturalWidth;
    }

    render() {
        const scale = this.scale;
        const pix = this.pix;
        this.ctxFg.save();
        this.ctxFg.clearRect(0, 0, this.fg.width, this.fg.height);
        // Trick to draw perfect pixel
        this.ctxFg.translate(-0.5, -0.5);
        this.ctxFg.scale(scale, scale);
        // Set thickness to 1 true px
        this.ctxFg.lineWidth = 1 / scale;
        // this.ctxFg.strokeRect(getRandInt(10), getRandInt(6), 1.25, 1.25);
        this.ctxFg.strokeStyle = 'red';
        this.samePixelsPos.forEach((px) => {
            this.ctxFg.strokeRect(px.x, px.y, 1.25, 1.25);
        });
        this.ctxFg.strokeStyle = 'black';
        this.ctxFg.strokeRect(pix.x, pix.y, 1.25, 1.25);
        this.ctxFg.restore();
    }

    renderVirus() {
        for (var i = 0; i < this.virus.length; i++) {
            // template literal
            this.ctxBg.fillStyle = `rgb(${getRandInt(255)}, ${getRandInt(255)}, ${getRandInt(255)})`;
            // this.ctxBg.fillStyle = 'rgb(' + getRandInt(255) + ', ' + getRandInt(255) + ', ' + getRandInt(255) + ')';
            this.ctxBg.fillRect(this.virus[i][0], this.virus[i][1], 1, 1);
        }
    }

    propagateVirus() {
        const viruses = this.virus;
        function virusInArray(x, y) {
            return viruses.some((virus) => {
                return virus[0] == x && virus[1] == y;
            });
        }

        const [width, height] = this.getImageSize();
        const positions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const virusActualLength = viruses.length;
        for (var virusIndex = 0; virusIndex < virusActualLength; virusIndex++) {
            const virus = viruses[virusIndex];
            positions.forEach( (pos) => {
                const x = virus[0] + pos[0];
                const y = virus[1] + pos[1];
                if (((x < width && x > -1) && (y < height && y > -1)) && !virusInArray(x, y)) {
                    this.virus.push([x, y]);
                }
            });
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    onKeyDown(e) {
        const [width, height] = this.getImageSize();
        console.log(width, height);
        if (e.code == 'ArrowRight' || e.code == 'KeyD') {
            this.pix.x += this.pix.x + 1 < width ? 1 : 0;
        }
        else if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
            this.pix.x -= this.pix.x > 0 ? 1 : 0;
        }
        else if (e.code == 'ArrowUp' || e.code == 'KeyW') {
            this.pix.y -= this.pix.y > 0 ? 1 : 0;
        }
        else if (e.code == 'ArrowDown' || e.code == 'KeyS') {
            this.pix.y += this.pix.y + 1 < height ? 1 : 0;
        }
        if (e.code.includes('Arrow') || ['D', 'A', 'W', 'S'].includes(e.code.replace('Key', ''))) {
            this.samePixelsPos = this.getPixelsWithSameColor(this.pix.x, this.pix.y);
        }
    }

    onClick(e) {
        const x = Math.floor(e.clientX / this.screenScale);
        const y = Math.floor(e.clientY / this.screenScale);
        if (this.samePixelsPos.some(pos => pos.x == x && pos.y == y)) {
            this.pix.x = x;
            this.pix.y = y;
            this.samePixelsPos = this.getPixelsWithSameColor(this.pix.x, this.pix.y);
        }
    }

    getImageSize() {
        const imgWidth = this.img.naturalWidth;
        const ratio =  window.innerHeight / window.innerWidth;
        const width = Math.floor(imgWidth / 1);
        const height = Math.ceil(imgWidth / 1 * ratio);
        return [width, height];
    }

    getScreenData() {
        return this.ctxBg.getImageData(0, 0, this.bg.width, this.bg.height)
    }

    getPixColor() {
        return this.ctxBg.getImageData(this.pix.x, this.pix.y, 1, 1).data;
    }

    getPixelsWithSameColor(posX, posY) {
        const samePixelsPos = [];
        const { width, height, data } = this.getScreenData();
        const posAsIndex = (posY * width + posX) * 4;
        const baseColor = data.slice(posAsIndex, posAsIndex + 4);
        for (let i = 0, len = data.length; i < len ; i += 4) {
            if (i == posAsIndex) {
                continue;
            }
            let currentColor = data.slice(i, i + 4);
            if (arraysAreEqual(baseColor, currentColor, 4)) {
                let x = i / 4 % width;
                let y = Math.floor(i / 4 / width);
                samePixelsPos.push({x, y});
            }
        }
        return samePixelsPos;
    }
}


function arraysAreEqual(arr1, arr2, len) {
    for (let i = 0; i < len; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}


function getRandInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export { Game };
