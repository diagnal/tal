/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.keyhandlers.keyhandler class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define("antie/widgets/carousel/keyhandlers/keyhandler", [
    "antie/class"
], function(Class) {
    "use strict";
    /**
     * The base KeyHandler class moves alignment of the carousel on LEFT and RIGHT key presses
     * when attached to a Carousel with Horizontal orientation, and moves alignment on UP and
     * DOWN key presses when attached to a Carousel with Vertical orientation.
     * @name antie.widgets.carousel.keyhandlers.KeyHandler
     * @class
     * @extends antie.widgets.Widget
     */
    return Class.extend(
        /** @lends antie.widgets.carousel.keyhandlers.KeyHandler.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init() {
                this._animationOptions = {};
            },

            /**
             * Adds listeners to the supplied carousel to provided behaviour when navigation keys are pressed
             * @param carousel
             */
            attach: function attach(carousel) {
                this._carousel = carousel;
                this.PREVIOUS = carousel.orientation().defaultKeys().PREVIOUS;
                this.NEXT = carousel.orientation().defaultKeys().NEXT;
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
            setAnimationOptions: function setAnimationOptions(options) {
                this._animationOptions = options;
            },

            _addKeyListeners: function _addKeyListeners() {
                var myprevious, myNext;
                var nxtTimeOUt;
                var self = this;
                var carousel = this._carousel;
                var timeOutHandle = undefined;
                var intervalHandle = undefined;
                var keyblockerActive = false;
                carousel.addEventListener("keydown", function(ev) {
                    self.keyUpPressed = false;
                    if (keyblockerActive) {
                        ev.stopPropagation();
                        return;
                    }
                    keyblockerActive = true;
                    setTimeout(function() {
                        keyblockerActive = false;
                    }, 300);
                    switch (ev.keyCode) {
                        case self.PREVIOUS:
                            if (carousel.previousIndex() !== null) {
                                carousel.completeAlignment();
                                carousel.alignPrevious(self._animationOptions);
                                ev.stopPropagation();
                                checklongPress(ev);
                            } else {
                                clearTimeout(timeOutHandle);
                                clearInterval(intervalHandle);
                            }
                            break;

                        case self.NEXT:
                            if (carousel.nextIndex() !== null) {
                                carousel.completeAlignment();
                                carousel.alignNext(self._animationOptions);
                                ev.stopPropagation();
                                checklongPress(ev);
                            } else {
                                clearTimeout(timeOutHandle);
                                clearInterval(intervalHandle);
                            }

                            break;
                    }
                });

                function checkPrevious(event, carousel) {
                    if (carousel.previousIndex() !== null) {
                        carousel.completeAlignment();
                        carousel.alignPrevious(self._animationOptions);
                        event.stopPropagation();
                    }
                }

                function checkNext(event, carousel) {
                    if (carousel.nextIndex() !== null) {
                        carousel.completeAlignment();
                        carousel.alignNext(self._animationOptions);
                        event.stopPropagation();
                    }
                }

                function checklongPress(event) {
                    if (self.keyUpPressed) {
                        return;
                    }
                    timeOutHandle = setTimeout(function() {
                        clearInterval(intervalHandle);
                        if (self.keyUpPressed) {
                            return;
                        }
                        intervalHandle = setInterval(function() {
                            if (self.keyUpPressed) {
                                return;
                            }
                            if (event.keyCode == self.PREVIOUS) {
                                self._animationOptions.duration = 200;
                                self._animationOptions.easing = "linear";
                                checkPrevious(event, carousel);
                            } else if (event.keyCode == self.NEXT) {
                                self._animationOptions.duration = 200;
                                self._animationOptions.easing = "linear";
                                checkNext(event, carousel);
                            }
                            self._animationOptions.duration = 300;
                            self._animationOptions.easing = "easeFromTo";
                        }, 200);
                    }, 400);
                }

                carousel.addEventListener(
                    "keyup",
                    function(ev) {
                        this.keyUpPressed = true;
                        clearInterval(intervalHandle);
                        clearTimeout(timeOutHandle);
                    }.bind(this)
                );
            },

            _addAlignmentListeners: function _addAlignmentListeners() {}
        }
    );
});
