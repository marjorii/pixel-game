const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

fetch('images/map.jpg')
.then((response) => response.blob())
.then((blob) => {
    let img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
        canvas.width = img.naturalWidth / 4;
        canvas.height = img.naturalHeight / 4;
        ctx.drawImage(img, 0, 0);
    }
});
