'use strict';

export default class Game {

   constructor() {
      this._maxFrames = 10;
      this._minRoll = 1;
      this._maxRolls = 2;
      this._maxPins = 10;
      this._minPins = 0;
      this._symbolStrike = 'X';
      this._symbolSpare = '/';
      this._symbolMiss = '-';

      this.currentFrame = 1;
      this.currentRoll = 1;
      this.hitPinsInCurrentFrame = 0;
      this.score = 0;

   }


   /**
    * returns a random number of hit pins on current roll.
    * @param hitPinsInCurrentFrame
    * @returns {number}
    * @private
    */
   _getRandomHitPins(hitPinsInCurrentFrame) {
      return Math.floor(Math.random() * ((this._maxPins - hitPinsInCurrentFrame) - this._minPins + 1)) + this._minPins;
   }

   /**
    * returns the symbol that represents the roll score
    * @param hitPinsInCurrentFrame
    * @param currentRoll
    * @returns {string}
    * @private
    */
   _getSymbolRoll(hitPinsInCurrentFrame, currentRoll) {
      let symbol;

      //the player has hit all the pins
      if (hitPinsInCurrentFrame === this._maxPins) {
         symbol = currentRoll === this._minRoll ? this._symbolStrike : this._symbolSpare;
      }
      //the player has miss all the pins
      else if (hitPinsInCurrentFrame === 0) {
         symbol = this._symbolMiss;
      }
      else {
         symbol = hitPinsInCurrentFrame
      }

      return String(symbol);
   }

   /**
    *
    * @param currentFrame
    * @param currentRoll
    * @param hitPinsInCurrentRoll
    */
   updateRollScore(currentFrame, currentRoll, hitPinsInCurrentRoll) {
      let rollSymbol = this._getSymbolRoll(hitPinsInCurrentRoll, currentRoll)

      console.log (currentFrame, currentRoll, hitPinsInCurrentRoll, rollSymbol);

      // update scoring
      const currentRollCell = document.querySelector(`.frame-${currentFrame} .frame__roll${currentRoll}`);
      currentRollCell.textContent = rollSymbol;
   }


   /**
    * update the frame score
    * @param currentFrame
    * @param hitPinsInCurrentRoll
    */
   updateFrameScore(currentFrame, hitPinsInCurrentRoll) {
      this.hitPinsInCurrentFrame += hitPinsInCurrentRoll;

      const frameScoreCell = document.querySelector(`.frame-${currentFrame} .frame__score`);
      frameScoreCell.textContent = this.hitPinsInCurrentFrame;
   }

   /**
    *
    */
   prepareNextRoll() {

      console.log('this.isFrameFinished()', this.isFrameFinished());
      if (this.isFrameFinished()) {
         this.currentFrame++;
         this.currentRoll = this._minRoll;
         this.hitPinsInCurrentFrame = 0;
      }
      else {
         this.currentRoll += 1;
      }
   }

   /**
    * update the sum of all frames for the player
    */
   updatePlayerScore() {
      this.score += this.hitPinsInCurrentFrame;

      const frameScoreCell = document.querySelector(`.frame-total .frame__score`);
      frameScoreCell.textContent = this.score;
   }

   /**
    * returns true when the player has finish the current frame.
    * @returns {boolean}
    */
   isFrameFinished() {
      //on the last frame
      if (this.currentFrame < this._maxFrames) {
         //the players has not hit all the pins on the first 2 rolls
         if (this.currentRoll === this._maxRolls && this.hitPinsInCurrentFrame < this._maxPins) {
            return true;
         }

         //the player has reached the third roll
         if (this.currentRoll === this._maxRolls + 1) {
            return true;
         }
      }

      //from frame 1 to 9, the player has already roll twice
      if (this.currentRoll === this._maxRolls) {
         return true;
      }

      //all the pins have been hit (strike)
      //this statement can be simplified, I keep it for clarity.
      if (this.hitPinsInCurrentFrame === this._maxPins) {
         return true;
      }

      return false;
   }

   /**
    * returns true when the game has finished
    * @returns {boolean}
    */
   isGameEnded() {
      return this.currentFrame > this._maxFrames;
   }

   /**
    *
    */
   onGameEnd() {
      document.querySelector('.game').classList.add('game--ended');
   }

   /**
    * execute the player roll
    */
   roll() {
      // generate a random number of hit pins
      let hitPinsInCurrentRoll = this._getRandomHitPins(this.hitPinsInCurrentFrame);

      this.updateRollScore(this.currentFrame, this.currentRoll, hitPinsInCurrentRoll);
      this.updateFrameScore(this.currentFrame, hitPinsInCurrentRoll);
      this.updatePlayerScore();

      this.prepareNextRoll();

      if (this.isGameEnded()) {
         this.onGameEnd();
      }
   }
}
