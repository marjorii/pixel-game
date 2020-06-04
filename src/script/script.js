const scale = 4;
const pix = {
    x: 2,
    y: 3
}

const bg = document.getElementById('background');
const fg = document.getElementById('foreground');
let ratio =  window.innerHeight / window.innerWidth;
const ctx = bg.getContext('2d');
const ctx2 = fg.getContext('2d');

fetch('images/map.jpg')
.then((response) => response.blob())
.then((blob) => {
    let img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
        let width = Math.floor(img.naturalWidth / 1);
        let height = Math.ceil(img.naturalWidth / 1 * ratio);
        bg.width = width;
        bg.height = height;
        ctx.drawImage(img, 0, 0);

        fg.width = width * scale;
        fg.height = height * scale;
        // Trick to draw perfect pixel
        ctx2.translate(-0.5, -0.5);
        ctx2.scale(scale, scale);
        // Set thickness to 1 true px
        ctx2.lineWidth = 1 / scale;
        ctx2.strokeRect(pix.x, pix.y, 1.25, 1.25);
    }
});
