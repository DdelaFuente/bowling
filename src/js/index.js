'use strict';

import Game from './game';


/**
 * triggers a callback function after a button is clicked
 * @param game
 */
function handleOnClick(game) {
   const buttonAddPlayer = document.querySelector('.btn-add-player');
   buttonAddPlayer.addEventListener('click', () => game.addPlayer());

   const buttonPlay = document.querySelector('.btn-play');
   buttonPlay.addEventListener('click', () => game.play());

   const buttonRoll = document.querySelector('.btn-roll');
   buttonRoll.addEventListener('click', () => game.roll());
}



function init() {
   const game = new Game();

   //init game with at least one player
   game.addPlayer();

   handleOnClick(game);
}


init();
