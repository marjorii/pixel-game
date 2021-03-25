import { Game } from './game.js';

window.onload = function() {
    const game = new Game();
    const bg = document.getElementById('background');
    const fg = document.getElementById('foreground');
    game.init(bg, fg, 'images/map.jpg');
}
