import {MAX_FRAMES, MAX_ROLLS, MAX_PINS, MIN_PINS, MAX_ROLLS_LAST_FRAME} from './game';

class Player {

   constructor() {
      this.currentFrameIndex = 1;
      this.frames = [];
      this.points = [];

      this._initPlayer()
   }

   /**
    * initialises the player's frames
    * @private
    */
   _initPlayer() {
      for (let i = 0; i <= MAX_FRAMES - 2; i++) {
         this.frames[i] = [null, null];
      }

      //last frame has 3 possible rolls
      this.frames[MAX_FRAMES - 1] = [null, null, null];
   }

   /**
    * returns total hit pins for current frame
    * @param indexFrame
    * @private
    */
   _getHitsInFrame(indexFrame) {
      return this.frames[indexFrame].reduce((result, value) =>
         result + value || 0, 0);
   }


   /**
    * returns a random number of hit pins on current roll.
    * @returns {number}
    * @private
    */
   _getRandomPossibleHitPins(indexFrame) {
      let pinsAlreadyHit = this._getHitsInFrame(indexFrame);
      return Math.floor(Math.random() * ((MAX_PINS - pinsAlreadyHit) - MIN_PINS + 1)) + MIN_PINS;
   }


   /**
    * returns the total score for the player
    * @returns {number}
    */
   getScore() {
      return this.points.reduce((result, value) =>
         result + value, 0);
   }


   /**
    * returns how many times the player has roll the ball on a specific frame
    * @param indexFrame
    */
   getUsedRollsInFrame(indexFrame) {
      return this.frames[indexFrame].reduce((total, item) => {
         return item === null ? total : total + 1
      }, 0);
   }


   /**
    * returns true when the player has finish the current frame.
    * @param indexFrame
    * @returns {boolean}
    */
   isFrameFinished(indexFrame) {
      //on the last frame
      if (indexFrame === MAX_FRAMES) {
         //the players has roll twice and did not hit all the pins
         if (this.getUsedRollsInFrame(indexFrame) === MAX_ROLLS && this._getHitsInFrame(indexFrame) < MAX_PINS) {
            return true;
         }

         //the player has reached the third roll
         if (this.getUsedRollsInFrame(indexFrame) === MAX_ROLLS_LAST_FRAME) {
            return true;
         }
      }

      //from frame 1 to 9,
      if (indexFrame < MAX_FRAMES) {
         // the player has already roll twice
         if (this.getUsedRollsInFrame(indexFrame) === MAX_ROLLS) {
            return true;
         }

         //all the pins have been hit (strike)
         //this statement can be simplified, I keep it for clarity.
         if (this._getHitsInFrame(indexFrame) === MAX_PINS) {
            return true;
         }
      }

      return false;
   }


   /**
    * generates a random hit pins
    * @param indexFrame
    */
   roll(indexFrame) {
      let currentIndexRoll = this.getUsedRollsInFrame(indexFrame);
      this.frames[indexFrame][currentIndexRoll] = this._getRandomPossibleHitPins(indexFrame);
   }
}


export default Player;
