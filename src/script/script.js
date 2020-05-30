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
        let width = Math.floor(img.naturalWidth / 4);
        let height = Math.ceil(img.naturalWidth / 4 * ratio);
        bg.width = width;
        bg.height = height;
        ctx.drawImage(img, 0, 0);

        fg.width = width * 4;
        fg.height = height * 4;
        ctx2.translate(-0.5, -0.5);
        ctx2.scale(4, 4);
        ctx2.lineWidth = 0.25;

        ctx2.strokeRect(33, 12, 1.25, 1.25);
    }
});
