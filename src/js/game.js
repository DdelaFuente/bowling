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

      this.hits = [];
      this.points = [];

      this.initPlayer()
   }

   //todo separate
   initPlayer() {
      for (let i = 0; i <= this._maxFrames - 2; i++) {
         this.hits[i] = [0, 0];
      }

      //last frame has 3 possible rolls
      this.hits[this._maxFrames - 1] = [0, 0, 0];

      for (let i = 0; i <= this._maxFrames - 1; i++) {
         this.points[i] = null;
      }
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
    * @param hitPinsInCurrentRoll
    * @param currentRoll
    * @returns {string}
    * @private
    */
   _getSymbolRoll(hitPinsInCurrentRoll, currentRoll) {
      let symbol;

      //the player has hit all the pins
      if (this.getHitsInCurrentFrame() === this._maxPins) {
         symbol = currentRoll < this._maxRolls ? this._symbolStrike : this._symbolSpare;
      }
      //the player has miss all the pins
      else if (hitPinsInCurrentRoll === 0) {
         symbol = this._symbolMiss;
      }
      else {
         symbol = hitPinsInCurrentRoll
      }

      return String(symbol);
   }

   /**
    * return total hit pins for current frame
    */
   getHitsInCurrentFrame() {
      return this.hits[this.currentFrame - 1].reduce((result, value) =>
         result + value, 0);
   }

   /**
    *
    * @param currentFrame
    * @param currentRoll
    * @param hitPinsInCurrentRoll
    */
   updateRollScore(currentFrame, currentRoll, hitPinsInCurrentRoll) {
      this.hits[currentFrame - 1][currentRoll - 1] = hitPinsInCurrentRoll;

      let rollSymbol = this._getSymbolRoll(hitPinsInCurrentRoll, currentRoll);

      // update scoring
      const currentRollCell = document.querySelector(`.frame-${currentFrame} .frame__roll${currentRoll}`);
      currentRollCell.textContent = rollSymbol;
   }

   /**
    * update the frame score
    */
   updateFramesScore() {
      for (let i = 0; i <= this.currentFrame - 1; i++) {
         let extraPoints = 0;

         //extra points for strike
         if (this.hits[i][0] === this._maxPins) {
            extraPoints = this.hits[i + 1][0] + this.hits[i + 1][1] ;
         }
         //extra points for spare
         else if (this.hits[i][0] + this.hits[i][1] === this._maxPins) {
            extraPoints = this.hits[i + 1][0];
         }

         this.points[i] = this.hits[i][0] + this.hits[i][1] + extraPoints;

         const frameScoreCell = document.querySelector(`.frame-${i + 1} .frame__score`);
         frameScoreCell.textContent = this.points[i];
      }
   }

   /**
    * update the sum of all frames for the player
    */
   updatePlayerScore() {
      let totalScore = this.points.reduce((result, value) =>
         result + value, 0);

      const frameScoreCell = document.querySelector(`.frame-total .frame__score`);
      frameScoreCell.textContent = totalScore;
   }

   /**
    *
    */
   prepareNextFrame() {
      this.currentFrame += 1;
      this.currentRoll = this._minRoll;
   }

   prepareNextRoll() {
      this.currentRoll += 1;
   }

   /**
    * returns true when the player has finish the current frame.
    * @returns {boolean}
    */
   isFrameFinished() {
      //on the last frame
      if (this.currentFrame === this._maxFrames) {
         //the players has roll twice and did not hit all the pins
         if (this.currentRoll === this._maxRolls && this.getHitsInCurrentFrame() < this._maxPins) {
            return true;
         }

         //the player has reached the third roll
         if (this.currentRoll === this._maxRolls + 1) {
            return true;
         }
      }

      //from frame 1 to 9,
      if (this.currentFrame < this._maxFrames) {
         // the player has already roll twice
         if (this.currentRoll === this._maxRolls) {
            return true;
         }

         //all the pins have been hit (strike)
         //this statement can be simplified, I keep it for clarity.
         if (this.getHitsInCurrentFrame() === this._maxPins) {
            return true;
         }
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
      let hitPinsInCurrentRoll = this._getRandomHitPins(this.getHitsInCurrentFrame());

      this.updateRollScore(this.currentFrame, this.currentRoll, hitPinsInCurrentRoll);
      this.updateFramesScore();
      this.updatePlayerScore();

      if (this.isFrameFinished()) {
         this.prepareNextFrame();
      }
      else {
         this.prepareNextRoll();
      }

      if (this.isGameEnded()) {
         this.onGameEnd();
      }
   }
}
