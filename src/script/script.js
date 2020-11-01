import { Game } from './game.js';

window.onload = function() {
    const game = new Game();
    const bg = document.getElementById('background');
    const fg = document.getElementById('foreground');
    game.init(bg, fg, 'images/map.jpg');
}

// To do :
// Si la position d'un nouveau virus est en dehors de l'image, ne pas l'ajouter.
// Ne pas ajouter un virus s'il est déjà dans virus.
