/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.keyhandlers.keyhandler class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
  'antie/widgets/carousel/keyhandlers/keyhandler',
  [
      'antie/class'
  ],
  function (Class) {
      'use strict';
      /**
       * The base KeyHandler class moves alignment of the carousel on LEFT and RIGHT key presses
       * when attached to a Carousel with Horizontal orientation, and moves alignment on UP and
       * DOWN key presses when attached to a Carousel with Vertical orientation.
       * @name antie.widgets.carousel.keyhandlers.KeyHandler
       * @class
       * @extends antie.widgets.Widget
       */
      return Class.extend(/** @lends antie.widgets.carousel.keyhandlers.KeyHandler.prototype */{
          /**
           * @constructor
           * @ignore
           */
          init: function init () {
              this._animationOptions = {};
          },

          /**
           * Adds listeners to the supplied carousel to provided behaviour when navigation keys are pressed
           * @param carousel
           */
          attach: function attach (carousel) {
              this._carousel = carousel;
              this._addKeyListeners();
              this._addAlignmentListeners();
          },

          /**
           * Sets default animation options for key handled alignments
           * @param options {Object} Animation options object
           * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
           * @param {Number} [options.duration] The duration of the alignment in ms
           * @param {String} [options.easing] The alignment easing function
           * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
           * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
           */
          setAnimationOptions: function setAnimationOptions (options) {
              this._animationOptions = options;
          },

          _addKeyListeners: function _addKeyListeners () {
              var previousKey, nextKey, carousel, self;
              var myprevious,myNext;
          var prvsTimeOUt,nxtTimeOUt;
              self = this;
              carousel = this._carousel;
              previousKey = carousel.orientation().defaultKeys().PREVIOUS;
              nextKey = carousel.orientation().defaultKeys().NEXT;
              carousel.addEventListener('keydown', function (ev) {
                  switch (ev.keyCode) {
                  case previousKey:  
                  if (carousel.previousIndex() !== null) {
                      carousel.completeAlignment();
                      carousel.alignPrevious(self._animationOptions);
                      ev.stopPropagation();
                      checkpreviousLongPress(ev);
                  } else{
                      clearTimeout(prvsTimeOUt);
                      clearInterval(myprevious);
                  }           
                  
            
                      break;
                  case nextKey:
                  if (carousel.nextIndex() !== null) {
                      carousel.completeAlignment();
                      carousel.alignNext(self._animationOptions);
                      ev.stopPropagation();
                      checklongPress(ev);
                  }else{
                      clearTimeout(nxtTimeOUt);
                      clearInterval(myNext); 
                  }
               
                      break;
                  }
              });
              
function checkpreviousLongPress(ev){
  prvsTimeOUt=   setTimeout(function(){
              myprevious = setInterval(function(){
                  console.log("inside previous key");
                           if (carousel.previousIndex() !== null) {
                          carousel.completeAlignment();
                          carousel.alignPrevious(self._animationOptions);
                          ev.stopPropagation();}
              },100);},400);
          }

function checklongPress(ev){
nxtTimeOUt=  setTimeout(function(){
  myNext = setInterval(function(){
      console.log("inside next key");
      if (carousel.nextIndex() !== null) {
          carousel.completeAlignment();
          carousel.alignNext(self._animationOptions);
          ev.stopPropagation();
      }
  },100);},400);
}
              carousel.addEventListener('keyup', function (ev) {
                  switch (ev.keyCode) {
                      case previousKey:
                      console.log(" previous key up");
                      clearTimeout(prvsTimeOUt);
                      clearInterval(myprevious);
                      break;

                      case nextKey:
                      console.log(" next key up");
                      clearTimeout(nxtTimeOUt);
                      clearInterval(myNext);
                      break;
                  }});
          },

          _addAlignmentListeners: function _addAlignmentListeners () {

          }
      });
  }
);