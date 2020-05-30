const bg = document.getElementById('background');
let ratio =  window.innerHeight / window.innerWidth;
const ctx = bg.getContext('2d');

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
    }
});
