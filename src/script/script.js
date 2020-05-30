const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

fetch('images/path.jpg')
.then((response) => response.blob())
.then((blob) => {
    let img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    }
    img.src = URL.createObjectURL(blob);
    console.log(img);
})


// ctx.fillStyle = 'green';
// ctx.fillRect(0, 0, 100, 50);
