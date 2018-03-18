'use strict';

import Game from './game';

const game = new Game();

const buttonRoll = document.querySelector('.button-play');
if (buttonRoll) {
   buttonRoll.addEventListener('click', () => game.roll());
}

