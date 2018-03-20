/**
 * @fileOverview Requirejs module containing the antie.widgets.HorizontalList class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/horizontallist',
    [
        'antie/widgets/list',
        'antie/events/keyevent'
    ],
    
    function(List, KeyEvent) {
        'use strict';

        /**
         * The HorizontalList widget is a container widget that supports spatial navigation between items using {@link KeyEvent.VK_LEFT} and {@link KeyEvent.VK_RIGHT}.
         * @name antie.widgets.HorizontalList
         * @class
         * @extends antie.widgets.List
         * @requires antie.events.KeyEvent
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         * @param {antie.Formatter} [itemFormatter] A formatter class used on each data item to generate the list item child widgets.
         * @param {antie.DataSource|Array} [dataSource] An array of data to be used to generate the list items, or an aysnchronous data source.
         */
        var interval;
        var timeout;
        
        var HorizontalList = List.extend(/** @lends antie.widgets.HorizontalList.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (id, itemFormatter, dataSource) {
                // we need to wrap our contents in a mask to support animation
                this._maskElement = null;

                init.base.call(this, id, itemFormatter, dataSource);
                this.addClass('horizontallist');

                var self = this;
                this.addEventListener('keydown', function(e) {
                    self._onKeyDown(e,true,self);
                });
                this.addEventListener('keyup', function(e) {
                    self._onKeyUp(e);
                });
            },

            /**
             * Set whether to support wrapping within the list.
             * @param {Integer} wrapMode    Pass <code>HorizontalList.WRAP_MODE_NONE</code> for no wrapping.
             *                              Pass <code>HorizontalList.WRAP_MODE_NONE</code> to allow navigation to wrap.
             */
            setWrapMode: function setWrapMode (wrapMode) {
                this._wrapMode = wrapMode;
            },
            /**
             * Key handler for horizontal lists. Processes KeyEvent.VK_LEFT and KeyEvent.VK_RIGHT keys and stops propagation
             * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
             * spatial navigation out of the list.
             * @param {antie.events.KeyEvent} evt The key event.
             */
            _onKeyDown: function _onKeyDown (evt,isNormalPress,self) {
                if(evt.keyCode !== KeyEvent.VK_LEFT && evt.keyCode !== KeyEvent.VK_RIGHT) {
                    return;
                }

                var _newSelectedIndex = self._selectedIndex;
                var _newSelectedWidget = null;
                do {
                    if(evt.keyCode === KeyEvent.VK_LEFT) {
                        _newSelectedIndex--;
                    } else if(evt.keyCode === KeyEvent.VK_RIGHT) {
                        _newSelectedIndex++;
                    }

                    //force the index to wrap correctly
                    if(self._wrapMode === HorizontalList.WRAP_MODE_WRAP ) {
                        _newSelectedIndex = ( _newSelectedIndex + self._childWidgetOrder.length ) % self._childWidgetOrder.length;
                    } else if(_newSelectedIndex < 0 || _newSelectedIndex >= self._childWidgetOrder.length) {

                        break;
                    }
                    var _widget = self._childWidgetOrder[_newSelectedIndex];
                    if(_widget.isFocusable()) {
                        _newSelectedWidget = _widget;
                        break;
                    }
                } while(true);

                if(_newSelectedWidget) {
                    self.setActiveChildWidget(_newSelectedWidget);
                    evt.stopPropagation();
                }else{
                    clearTimeout(timeout);
                    clearInterval(interval);
                }
                if(isNormalPress){
                    timeout=setTimeout(function() {
                        clearInterval(interval);
                        interval=setInterval(function(){
                    _onKeyDown(evt,false,self)
                        },100)
                    }, 400);
                                        }
            
                return (_newSelectedWidget !== null);
            },

            _onKeyUp: function _onKeyUp (evt) {
                if(evt.keyCode !== KeyEvent.VK_LEFT && evt.keyCode !== KeyEvent.VK_RIGHT) {
                    return;
                }
                clearTimeout(timeout);
                clearInterval(interval);
            }
        });

        HorizontalList.WRAP_MODE_NONE = 0;
        HorizontalList.WRAP_MODE_WRAP = 1;

        return HorizontalList;
    }
);