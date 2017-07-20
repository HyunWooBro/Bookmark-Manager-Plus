/**
 * Toolbar.js
 *
 * @fileoverview  jQuery plugin that creates tooltip style toolbars.
 * @link          http://paulkinzett.github.com/toolbar/
 * @author        Paul Kinzett (http://kinzett.co.nz/)
 * @version       1.1.0
 * @requires      jQuery 1.7+
 *
 * @license jQuery Toolbar Plugin v1.1.0
 * http://paulkinzett.github.com/toolbar/
 * Copyright 2013 - 2015 Paul Kinzett (http://kinzett.co.nz/)
 * Released under the MIT license.
 * <https://raw.github.com/paulkinzett/toolbar/master/LICENSE.txt>
 * 
 * @modifier      Kim Hyun-Woo
 */
 
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ) {

    var ToolBar = {
        init: function( options, elem ) {
            var self = this;
            self.elem = elem;
            self.$elem = $( elem );
            self.options = $.extend( {}, $.fn.toolbar.options, options );
            self.metadata = self.$elem.data();
            self.overrideOptions();
            self.toolbar = $('<div class="tool-container" />')
                .addClass('tool-'+self.options.position)
                .addClass('toolbar-'+self.options.style)
                .append('<div class="tool-items" />')
                .append('<div class="arrow" />')
                .appendTo('body')
				//.css('opacity', 0)
                .hide();
            self.toolbar_arrow = self.toolbar.find('.arrow');
            self.initializeToolbar();
        },

        overrideOptions: function() {
            var self = this;
            $.each( self.options, function( $option ) {
                if (typeof(self.$elem.data('toolbar-'+$option)) != "undefined") {
                    self.options[$option] = self.$elem.data('toolbar-'+$option);
                }
            });
        },

        initializeToolbar: function() {
            var self = this;
            self.populateContent();
            self.setTrigger();
            self.toolbarWidth = self.toolbar.outerWidth();
        },

        setTrigger: function() {
            var self = this;

            if (self.options.event != 'click') {
			
				var moveTime;
				var returntime = -1;
                function decideTimeout () {
                    if (self.$elem.hasClass('pressed')) {
						moveTime = setTimeout(function() {
							//console.error("hide");
							self.hide();
						}, 200);
						//console.error("decideTimeout : " + moveTime);
                    } else {
                        clearTimeout(moveTime);
                    };
                };
			
				var preventsMouseLeave = false;
                self.$elem.on({
                    mouseenter: function(event) {
						//console.error("mouseenter2");
                        if (self.$elem.hasClass('pressed')) {
                            clearTimeout(moveTime);
							clearTimeout(returntime);
							returntime = -1;
                        } else {
                            self.show();
                        }
                    },
					mouseleave: function(event) { 
						//console.error("mouseleave2");
						if(preventsMouseLeave) return;
						decideTimeout(); 
					},
					// temporary off mouseleave
					mouseleaveoff: function(event, timeout) {
						preventsMouseLeave = true;
						setTimeout(function() {
							preventsMouseLeave = false;
						}, timeout);
					},
					// timeout for return
					returntimeout: function(event, timeout) {
						if(returntime != -1) return;
						returntime = setTimeout(function() {
							decideTimeout(); 
						}, timeout);
					},
                });

				self.toolbar.on({
					mouseup: function(event) {
						//console.error("click");
						// mouseup을 하면 간혹 mouseleave 이벤트가 발생하는 문제를 해결하기 위해
						// mouseleave 이벤트가 발생하면 clearTimeout이 바로 처리된다.
						// https://stackoverflow.com/questions/18594112/how-to-prevent-triggering-mouseleave-after-mouseup
						setTimeout(function() {
							clearTimeout(moveTime);
							//console.error("clearTimeout(moveTime) : " + moveTime);
						}, 0);
					},
					mouseenter: function(event){ 
						//console.error("mouseenter");
						clearTimeout(moveTime); 
						clearTimeout(returntime);
						returntime = -1;
					},
					mouseleave: function(event){ 
						//console.error("mouseleave");
						if(preventsMouseLeave) return;
						decideTimeout();
					},
                });
				
				$rightFrame.get(0).addEventListener('mousedown', function(e) {
					if (e.target != self.elem &&
						e.target != self.toolbar.get(0) &&
						self.$elem.has(e.target).length === 0 &&
						self.toolbar.has(e.target).length === 0 &&
						self.toolbar.is(":visible")) {
							//console.error("3rd hide")
						self.hide();
					}
				}, true);
            }

            $(window).resize(function( event ) {
                event.stopPropagation();
                if ( self.toolbar.is(":visible") ) {
                    self.toolbarCss = self.getCoordinates(self.options.position, 20);
                    self.collisionDetection();
                    self.toolbar.css( self.toolbarCss );
					self.toolbar.css(self.options.toolbarCss);
                    self.toolbar_arrow.css( self.arrowCss );
                }
            });
        },

        populateContent: function() {
            var self = this;
			if(self.options.selectable) {
				var location = self.toolbar.find('.tool-items');
				var content = $(self.options.content).clone( true ).find('a').addClass('tool-item');
				location.html(content);
				location.find('.tool-item').on('click', function(event) {
					event.preventDefault();
					self.$elem.trigger('toolbarItemClick', this);
				});
			}
			
			self.toolbar.append(self.options.addition);
        },

        calculatePosition: function() {
            var self = this;
                self.arrowCss = {};
                self.toolbarCss = self.getCoordinates(self.options.position, self.options.adjustment);
                self.toolbarCss.position = 'absolute';
                self.toolbarCss.zIndex = self.options.zIndex;
                self.collisionDetection();
                self.toolbar.css(self.toolbarCss);
				self.toolbar.css(self.options.toolbarCss);
                self.toolbar_arrow.css(self.arrowCss);
        },

        getCoordinates: function( position, adjustment ) {
            var self = this;
			self.coordinates = self.$elem.offset();

			if (self.options.adjustment && self.options.adjustment[self.options.position]) {
				adjustment = self.options.adjustment[self.options.position] + adjustment;
			}

			return {
				left: self.coordinates.left-(self.toolbarWidth/2)+(self.$elem.outerWidth()/2),
				top: self.coordinates.top+self.$elem.outerHeight()+adjustment,
				right: 'auto'
			};
        },

        collisionDetection: function() {
            var self = this;
			var edgeOffset = 20;
			if(self.options.position == 'bottom') {
				self.arrowCss = {left: '50%', right: '50%'};
				if(($(window).width() - (self.toolbarCss.left + self.toolbarWidth)) < edgeOffset) {
					self.toolbarCss.right = edgeOffset;
					self.toolbarCss.left = 'auto';
					self.arrowCss.left = 'auto';
					var borderWidth = self.toolbar.outerWidth() - self.toolbar.innerWidth();
					self.arrowCss.right = ($(window).width()-self.$elem.offset().left)-(self.$elem.outerWidth()/2)-(edgeOffset)-borderWidth/2;
					self.arrowCss.transform = "translateX(50%)";
				}
			}
        },

        show: function() {
			var $iconToolbars = $('.icon-toolbar > div:first-child');
			var length = $iconToolbars.length;
			for (var i = 0; i < length; i++) {
				var toolbarObj = $iconToolbars.eq(i).data('toolbarObj');
				if(toolbarObj.toolbar.is(":visible")) {
					toolbarObj.hide();
				}
			}
			
            var self = this;
            self.$elem.addClass('pressed');
            self.calculatePosition();
            self.toolbar.stop(true, true).show('fade', 125);
            self.$elem.trigger('toolbarShown');
        },

        hide: function() {
            var self = this;
			self.$elem.removeClass('pressed');
			self.toolbar.stop(true, true).hide('fade', 125);
			self.$elem.trigger('toolbarHidden');
        },

        getToolbarElement: function () {
            return this.toolbar.find('.tool-items');
        }
    };

    $.fn.toolbar = function( options ) {
        if ($.isPlainObject( options )) {
            return this.each(function() {
                var toolbarObj = Object.create( ToolBar );
                toolbarObj.init( options, this );
                $(this).data('toolbarObj', toolbarObj);
            });
        } else if ( typeof options === 'string' && options.indexOf('_') !== 0 ) {
            var toolbarObj = $(this).data('toolbarObj');
            var method = toolbarObj[options];
            return method.apply(toolbarObj, $.makeArray(arguments).slice(1));
        }
    };

    $.fn.toolbar.options = {
        content: '#myContent',
        position: 'top',
        hideOnClick: false,
        zIndex: 120,
        style: 'default',
        animation: 'standard',
        adjustment: 10,
		
		// additional
		addition: null,
		toolbarCss: '',
		selectable: true,
    };

}) ( jQuery, window, document );
