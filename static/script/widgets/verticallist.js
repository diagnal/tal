/**
 * @fileOverview Requirejs module containing the antie.widgets.VerticalList class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/verticallist',
    [
        'antie/widgets/list',
        'antie/events/keyevent'
    ],
    function(List, KeyEvent) {
        'use strict';

        /**
         * The VerticalList widget is a container widget that supports spatial navigation between items using {@link KeyEvent.VK_UP} and {@link KeyEvent.VK_DOWN}.
         * @name antie.widgets.VerticalList
         * @class
         * @extends antie.widgets.List
         * @requires antie.events.KeyEvent
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         * @param {antie.Formatter} [itemFormatter] A formatter class used on each data item to generate the list item child widgets.
         * @param {antie.DataSource|Array} [dataSource] An array of data to be used to generate the list items, or an asynchronous data source.
         */
        var interval;
        var timeout;
        return List.extend(/** @lends antie.widgets.VerticalList.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (id, itemFormatter, dataSource) {
                init.base.call(this, id, itemFormatter, dataSource);
                this.addClass('verticallist');

                var self = this;
                this.addEventListener('keydown', function(e) {
                    self._onKeyDown(e,true,self);
                });
                this.addEventListener('keyup', function(e) {
                    self._onKeyUp(e);
                });
            },
            /**
             * Key handler for vertical lists. Processes KeyEvent.VK_UP and KeyEvent.VK_DOWN keys and stops propagation
             * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
             * spatial navigation out of the list.
             * @param {antie.events.KeyEvent} evt The key event.
             */
            _onKeyDown: function _onKeyDown (evt,isNormalPress,self) {
                if(evt.keyCode !== KeyEvent.VK_UP && evt.keyCode !== KeyEvent.VK_DOWN) {
                    return;
                }

                var _newSelectedIndex = self._selectedIndex;
                var _newSelectedWidget = null;
                do {
                    if(evt.keyCode === KeyEvent.VK_UP) {
                        _newSelectedIndex--;
                    } else if(evt.keyCode === KeyEvent.VK_DOWN) {
                        _newSelectedIndex++;
                    }
                    if(_newSelectedIndex < 0 || _newSelectedIndex >= self._childWidgetOrder.length) {
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
                        interval=setInterval(function(){
                    _onKeyDown(evt,false,self)
                        },100)
                    }, 400);
                                        }
            },
            _onKeyUp: function _onKeyUp (evt) {
                if(evt.keyCode !== KeyEvent.VK_UP && evt.keyCode !== KeyEvent.VK_DOWN) {
                    return;
                }

            clearTimeout(timeout);
            clearInterval(interval);
            
            }
        });
    }
);