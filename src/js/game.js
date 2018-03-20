import Player from './player';

export const MAX_FRAMES = 10;
export const MAX_ROLLS = 2;
export const MAX_ROLLS_LAST_FRAME = 3;
export const MAX_PINS = 10;
export const MIN_PINS = 0;


export default class Game {

   constructor() {
      this.currentFrameIndex = 0;
      this.players = [];
      this.indexActivePlayer = 0;
   }

   /**
    * returns the symbol that represents the roll score
    * @param frame
    * @param indexRoll
    * @returns {string}
    * @private
    */
   _getSymbolRoll(frame, indexRoll) {
      const SYMBOL_STRIKE = 'X';
      const SYMBOL_SPARE = '/';
      const SYMBOL_MISS = '-';

      let symbol,
         hitsInRoll = frame[indexRoll];

      //the player has hit all the pins
      if (hitsInRoll === MAX_PINS) {
         symbol = SYMBOL_STRIKE;
      }
      //the player has miss all the pins
      else if (hitsInRoll === 0) {
         symbol = SYMBOL_MISS;
      }
      //the player has hit all the pins on the second roll
      else if (indexRoll > 0 && frame[indexRoll - 1] + frame[indexRoll] === MAX_PINS) {
         symbol = SYMBOL_SPARE;
      }
      else {
         symbol = hitsInRoll
      }

      return String(symbol);
   }


   /**
    * update the frame with the values for each roll
    * @param player
    * @param indexFrame
    * @private
    */
   _updateRollsScore(player, indexFrame) {
      let rollsInFrame = player.getUsedRollsInFrame(indexFrame);

      //length can be calculated before to optimise the loop.
      for (let i = 0; i < rollsInFrame; i++) {
         let rollSymbol = this._getSymbolRoll(player.frames[indexFrame], i);

         const currentRollCell = document.querySelector(`.player${this.indexActivePlayer + 1} .frame-${indexFrame + 1} .frame__roll${i + 1}`);
         currentRollCell.textContent = rollSymbol;
      }

   }


   /**
    * updates all the frames scores.
    * @param player
    * @param indexFrame
    * @private
    */
   _updateFramesScore(player, indexFrame) {
      //this could be optimised to update only the frames that have changed.
      for (let i = 0; i <= indexFrame; i++) {
         let extraPoints = 0;

         if (indexFrame < MAX_FRAMES - 1) {
            //extra points for strike
            if (player.frames[i][0] === MAX_PINS) {
               extraPoints = player.frames[i + 1][0] + player.frames[i + 1][1];
            }
            //extra points for spare
            else if (player.frames[i][0] + player.frames[i][1] === MAX_PINS) {
               extraPoints = player.frames[i + 1][0];
            }
         }

         player.points[i] = player.frames[i][0] + player.frames[i][1] + extraPoints;

         const frameScoreCell = document.querySelector(`.player${this.indexActivePlayer + 1} .frame-${i + 1} .frame__score`);
         frameScoreCell.textContent = player.points[i];
      }
   }


   /**
    * update the current total score for the player.
    * @private
    * @param player
    */
   _updatePlayerScore(player) {
      let score = player.getScore();

      const frameScoreCell = document.querySelector(`.player${this.indexActivePlayer + 1} .frame-total .frame__score`);
      frameScoreCell.textContent = String(score);
   }


   /**
    * returns true when the game has finished
    * @private
    * @returns {boolean}
    */
   _isGameEnded() {
      return this.currentFrameIndex === MAX_FRAMES - 1 && this.indexActivePlayer === this.players.length - 1;
   }


   /**
    * changes the toolbar and game state to reflect the game has finished.
    * @private
    */
   _onGameEnd() {
      let winner = this.getWinnerIndex();
      document.querySelector(`.player${winner + 1} .frame-total .frame__score`).classList.add('frame__score--winner');

      document.querySelectorAll('.player').forEach((lane) =>
         lane.classList.remove('player--active')
      );
      document.querySelector('.toolbar').classList.remove('toolbar--started');
      document.querySelector('.toolbar').classList.add('toolbar--finished');
   }


   /**
    * an specific style is applied to the active player lane to be highlighted.
    * @private
    */
   _markActivePlayersLane() {
      document.querySelectorAll('.player').forEach((lane) =>
         lane.classList.remove('player--active')
      );

      document.querySelector(`.player${this.indexActivePlayer + 1}`).classList.add('player--active');
   }


   /**
    * the next player has the turn
    * @private
    */
   _makeActiveNextPlayer() {
      this.indexActivePlayer += 1;

      if (this.indexActivePlayer === this.players.length) {
         this.indexActivePlayer = 0;
         this.currentFrameIndex += 1;
      }

      this._markActivePlayersLane();
   }


   /**
    * returns the winner index
    * @returns {number}
    */
   getWinnerIndex() {
      let arrayScores = this.players.map(player => player.getScore());

      return arrayScores.reduce((result, item, index) => {
         return item > arrayScores[result] ? index : result
      }, 0);
   }


   /**
    * adds a new player to the game
    */
   addPlayer() {
      let newPlayer = new Player();
      this.players.push(newPlayer);

      let playerId = this.players.length;

      //adds the new player lane to the board
      const newLane = document.querySelector('.player--template').cloneNode(true);
      newLane.classList.remove('player--template');
      newLane.classList.add(`player${playerId}`);
      document.querySelector('.game').appendChild(newLane);
   }


   /**
    * executes a single roll for the active player, showing the result score on the board.
    */
   roll() {
      let activePlayer = this.players[this.indexActivePlayer];

      activePlayer.roll(this.currentFrameIndex);
      this._updateRollsScore(activePlayer, this.currentFrameIndex);
      this._updateFramesScore(activePlayer, this.currentFrameIndex);
      this._updatePlayerScore(activePlayer);

      if (activePlayer.isFrameFinished(this.currentFrameIndex)) {
         if (this._isGameEnded()) {
            this._onGameEnd();
         }
         else {
            this._makeActiveNextPlayer();
         }
      }
   }

   /**
    * initialises the game, showing the roll button.
    */
   play() {
      document.querySelector('.toolbar').classList.add('toolbar--started');
      this._markActivePlayersLane();
   }
}

