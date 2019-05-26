var grnch;

(function() {
'use strict'

grnch = {
	_xmlns: "http://www.w3.org/2000/svg",
	
	warn: false,
	
	_anims: {},
	
	/*	param: {
			key: string,
			time: milisec,
			process: function(progress) {},
			*callback: function() {}
		}
	*/
	AddAnim: function(param) {
		if(	!param.key) {
			console.log('GRNC animated: Error, key is undefined.');
			return;
		}
		if(	!param.time) {
			console.log('GRNC animated: Error, time is undefined.');
			return;
		}
		if(	!param.process) {
			console.log('GRNC animated: Error, process is undefined.');
			return;
		}
		
		var animParam = {
			startTime: Date.now(),
			time: param.time,
			process: param.process
		};
		
		if(	param.callback) {
			animParam.callback = param.callback;
		}
		
		
		this._anims[param.key] = animParam;
	},

	_Animator: function() {
		if(Object.keys(grnch._anims).length) {
			var nowTime = Date.now();
			
			for(var animKey in grnch._anims) {
				var _elem = grnch._anims[animKey];
				
				var _progress = (nowTime - _elem.startTime) /_elem.time;
				if(_progress > 1) _progress = 1;
				_elem.process(_progress);
				if(_progress == 1) {
					delete grnch._anims[animKey];
					if(_elem.callback) _elem.callback();
				}
			}
		}
			
		window.requestAnimationFrame(grnch._Animator);
		
	},
	
	AddClass: function(nodeEl, addClass) {
		var _class = nodeEl.getAttributeNS(null, 'class');
		
		if( _class.indexOf(addClass) == -1) {
			nodeEl.className += ' '+addClass;
		}
	},
	
	/* nodeEl:'Node', class:'String' */
	RemoveClass: function(nodeEl, reClass) {
		var _classes = nodeEl.getAttributeNS(null, 'class').split(' ');
		for (var i=0; i < _classes.length; i++) {
			if (_classes[i] == reClass) {
				_classes.splice(i, 1);
				break;
			}
		}
		nodeEl.setAttributeNS(null, 'class', _classes.join(' ') );
	},
	
	/* elem:'Node', refElem:'Node' */
	InsertAfter: function(elem, refElem) {
		var parent = refElem.parentNode;
		var next = refElem.nextSibling;
		if (next) {
			parent.insertBefore(elem, next);
		} else {
			parent.appendChild(elem);
		}
	},
	
	/* Create HTML DOM
		*	Arr: [
			{
				type: string,
				(attributes): string,
				children: [
					...
				]
			},
			...
		]
	*/
	DOMCreator: function(arr) {
		var html = '';
		for(var key in arr) {
			var teg = '';
			switch(arr[key].type) {
			case 'img':
				html += '<img ';
				teg = '';
				break;
			case 'div':
			default:
				html += '<div ';
				teg = '</div>';
			}
			
			for(var att in arr[key]) {
				switch(att) {
				case 'type':
				case 'children':
				case 'html':
					continue;
				default:
					html += att+'="'+arr[key][att]+'" ';
					break;
				}
			}
			html += '>';
			
			if(arr[key]['html']) {
				html += arr[key]['html'];
			}
			
			if(arr[key].children) {
				html += grnch.DOMCreator(arr[key].children);
			}
			
			html += teg+' \n';
		}
		return html;
	},
	
	/* Create node element
			param: {
				type: string,
				(attributes): string,
				children: [node],
				html: string,
			}
	*/
	CreateNode: function(param) {
		var _Warning =  function( comment) {
			if( grnch.warn) {
				console.warn('WARN (grnch.CreateNode): '+comment);
				console.log('');
			}
		}
		
		var _element;
		var _isSVG = false;
		
		if( !param.type || param.type == 'div') {
			_element = document.createElement('div');
		} else {
			switch(param.type) {
				case 'g':
				case 'path':
				case 'polyline':
					_element = document.createElementNS( grnch._xmlns, param.type);
					_isSVG = true;
					break;
				default:
					_element = document.createElement( param.type);
					break;
			}
		}
		
		for(var att in param) {
			switch(att) {
			case 'type':
			case 'html':
			case 'children':
				continue;
			default:
				if( _isSVG) {
					_element.setAttributeNS( grnch._xmlns, att, param[att]);
				} else {
					_element.setAttribute( att, param[att]);
				}
				break;
			}
		}
		
		if( param['html']) {
			_element.innerHTML = param['html'];
		}
		
		if( param['children']) {
			for(var ind=0, len=param['children'].length; ind<len; ind++) {
				try {
					_element.appendChild( param['children'][ind]);
				} catch( err) {
					_Warning( err);
				}
			}
		}
		
		return _element;
	},
	
	/*	param: {
			id: 'Node',
			isActive: 'Boolean',
			*title: 'String',
			*width = 'Number',
			*height = 'Number',
			*minWidth = 'Number',
			*minHeight = 'Number',
			*children: {
				'Srting': 'String',	// 'child name': 'child id'.
				...
			},
			userResize: {
				isActive: 'Boolean' (true),
				reX: 'Boolean' (true),
				reY: 'Boolean' (true),
				location: 'String', (undefined) left || top || right || bottom
				callback: {
					start: function( width, height) {},
					move: function( width, height) {},
					end: function( width, height) {}
				}
			}
		}
	*/
	Window: function( param) {
		var _this = this;
		
		var _Error =  function( comment) {
			console.error('ERROR (grnch.Window): '+comment);
			console.warn('param: ', param);
			console.log('');
		}
		var _Warning =  function( comment) {
			if( grnch.warn) {
				console.warn('WARN (grnch.Window): '+comment);
				console.log('');
			}
		}
		
		if( !param.id) {
			_Error('param.id is undefined.');
			return;
		}
		this.node = document.getElementById( param.id);
		
		if( !this.node) {
			_Error('HTML element is not found.');
			return;
		}
		
		this.parentNode = this.node.parentNode;
		
		this.node.className += ' grnch-window';
	// Create title
		if( !param.title) {
			this.isTitle = false;
			// _Warning('param.title is undefined.');
		} else {
			this.isTitle = true;
			var _titlePanelElement = document.createElement('div');
			_titlePanelElement.className = 'grnch-titlePanel';
				var _tabElement = document.createElement('div');
				_tabElement.className = 'tab active';
				_tabElement.innerHTML = param.title;
				// _tabElement.addEventListener("mousedown", function(event) {
					// grnch._MouseDownListener( event, { module: 'window', action: 'move' } );
				// });
				
			_titlePanelElement.appendChild( _tabElement);
			
			this.node.appendChild(_titlePanelElement);
		}
		
	// User Resize
		if(	param.userResize != undefined) {
			var _urParam = param.userResize;
			
			this.userResize = {};
			
			this.userResize.element = document.createElement('div');
			
			// Location
			switch(_urParam.location) {
			case 'left':
				this.userResize.element.className = 'grnch-resizeLeft';
				this.userResize.reX = true;
				this.userResize.reY = false;
				this.userResize.location = 'left';
				break;
			case 'top':
				this.userResize.element.className = 'grnch-resizeTop';
				this.userResize.reX = false;
				this.userResize.reY = true;
				this.userResize.location = 'top';
				break;
			case 'right':
				this.userResize.element.className = 'grnch-resizeRight';
				this.userResize.reX = true;
				this.userResize.reY = false;
				this.userResize.location = 'right';
				break;
			case 'bottom':
				if( !this.isTitle) {
					this.userResize.element.className = 'grnch-resizeBottom';
				} else {
					this.userResize.element.className = 'grnch-resizeBottomOnTitle';
				}
				this.userResize.reX = false;
				this.userResize.reY = true;
				this.userResize.location = 'bottom';
				break;
			default:
				this.userResize.element.className = 'grnch-resizeArea';
				if( _urParam.reX === false) {
					this.userResize.reX = false;
				} else {
					this.userResize.reX = true;
				}
				
				if( _urParam.reY === false) {
					this.userResize.reY = false;
				} else {
					this.userResize.reY = true;
				}
				
				this.userResize.location = undefined;
			}
			
			
			if( _urParam.isActive === false) {
				this.userResize._isActive = false;
				this.userResize.element.style.display = 'none';
			} else {
				this.userResize._isActive = true;
			}
			
			Object.defineProperties(this.userResize, {
				isActive: {
					get: function() {
						return this._isActive;
					},
					/* val: 'Boolean' */
					set: function(val) {
						if( this._isActive == val
							&& typeof(val) != 'boolean'
						) { return; }
						
						this._isActive = val;
						
						 if( val) {
							 this.userResize.element.style = 'block';
						 } else {
							 this.userResize.element.style = 'none';
						 }
						 
					}
				}
			});
			
			if( _urParam.afterWindow) {
				this.userResize.afterWindow = _urParam.afterWindow;
			}
			
			var _supParam = {
				module: 'window', 
				action: 'resize',
				window: _this
			};
			
			if( _urParam.callback) {
				_supParam.evStart = _urParam.callback.start;
				_supParam.evMove = _urParam.callback.move;
				_supParam.evEnd = _urParam.callback.end;
			}
			this.userResize.element.addEventListener("mousedown", function(event) {
				grnch._MouseDownListener( event, _supParam);
			});
			
			this.node.appendChild(this.userResize.element);
		}
	
	// isActive	
		if( !param.isActive == undefined) {
			_Error('param.isActive is undefined.');
			this.isActive = false;
		} else {
			this.isActive = param.isActive;
		}
		
		if( this.isActive) {
			this.node.style.display = 'block';
		} else {
			this.node.style.display = 'none';
		}
	
	// Size
		if( param.adaptive
			&& param.adaptive === true
		) {
			this.adaptive = true;
		} else {
			this.adaptive = false;
		}
	
		if( param.width) {
			this._width = param.width;
			
			if( this.adaptive) {
				var _parentWidth = this.parentNode.clientWidth;
				this.node.style.width = 'calc(100% - '+( _parentWidth - param.width)+'px';
			} else {
				this.node.style.width = param.width+'px';
			}
		} else {
			this._width = this.node.clientWidth;
		}
		
		if( param.minWidth) {
			this._minWidth = param.minWidth;
		} else {
			this._minWidth = 100;
		}
		if( this._minWidth > this.width) {
			this._minWidth = this.width;
		}
		
		if( param.height) {
			this._height = param.height;
			
			if( this.adaptive) {
				var _parentHeight = this.parentNode.clientHeight;
				this.node.style.height = 'calc(100% - '+( _parentHeight - param.height)+'px';
			} else {
				this.node.style.height = param.height+'px';
			}
		} else {
			this._height = this.node.clientHeight;
		}
		
		if( param.minHeight) {
			this._minHeight = param.minHeight;
		} else {
			this._minHeight = 100;
		}
		if( this._minHeight > this.height) {
			this._minHeight = this.height;
		}
	
	// Children
		if( param.children) {
			this.children = {};
			
			for(var key in param.children) {
				var _childNode = document.getElementById( param.children[key] );
		
				if( !_childNode) {
					_Error( 'Child ('+key+') HTML element is not found.');
				} else {
					this.children[key] = _childNode;
				}
			}
			
		}
		
		this.show = function() {
			if( this.isActive) { return; }
			
			this.isActive = true;
			this.node.style.display = 'block';
		};
		
		this.hide = function() {
			if( !this.isActive) { return; }
			
			this.isActive = false;
			this.node.style.display = 'none';
		};
		
		Object.defineProperties(this, {
			width: {
				get: function() {
					return this._width;
				},
				/* val: 'Number' */
				set: function(val) {
					if( val >= this.minWidth) {
						if( this.adaptive) {
							var _parentWidth = this.parentNode.clientWidth;
							this.node.style.width = 'calc(100% - '+( _parentWidth - val)+'px';
						} else {
							this.node.style.width = val+'px';
						}
						
						this._width = val;
					}
				}
			},
			
			minWidth: {
				get: function() {
					return this._minWidth;
				},
				/* val: 'Number' */
				set: function(val) {
					this._minWidth = val;
					
					if( this._width < val) {
						this.width = val;
					}
				}
			},
			
			height: {
				get: function() {
					return this._height;
				},
				/* val: 'Number' */
				set: function(val) {
					if( val >= this.minHeight) {
						if( this.adaptive) {
							var _parentHeight = this.parentNode.clientHeight;
							this.node.style.height = 'calc(100% - '+( _parentHeight - val)+'px';
						} else {
							this.node.style.height = val+'px';
						}
						this._height = val;
					}
				}
			},
			
			minHeight: {
				get: function() {
					return this._minHeight;
				},
				/* val: 'Number' */
				set: function(val) {
					this._minHeight = val;
					
					if( this._height < val) {
						this.height = val;
					}
				}
			}
		});
		
	// Interface
		// for(var key in grnch.interface.window) {
			// this[key] = grnch.interface.window[key];
		// }
	},
	
	interface: {
		window: {
			
		}
	},
	
	/* 	event: 'Object',
		param: {
			module:'String',
			action:'String',
			...
		}
	*/
	_MouseDownListener: function( event, param) {
		switch(param.module) {
		case 'window':
			switch(param.action) {
			case 'move':
				var _barEl = event.target.parentNode.parentNode;
				if(!_barEl) { return; }
				
				var _move = { x: 0, y: 0 };
				
				_barEl.style.opacity = 0.5;
				
				var _OnMouseMove = function(event) {
					_move.x += event.movementX;
					_move.y += event.movementY;
					
					_barEl.style.transform = 'translate( '+_move.x+'px, '+_move.y+'px)';
				};
				var _OnMouseUp = function() {
					_barEl.style.opacity = '1';
					
					_barEl.style.transform = '';
					_barEl.style.left = (_barEl.offsetLeft + _move.x) +'px';
					_barEl.style.top = (_barEl.offsetTop + _move.y) +'px';
					
					document.removeEventListener("mousemove", _OnMouseMove);
					document.removeEventListener("mouseup", _OnMouseUp);
				};
				
				document.addEventListener("mousemove", _OnMouseMove);
				document.addEventListener("mouseup", _OnMouseUp);
				break;
				
			case 'resize':
				var _window = param.window;
				var _afterWindow = _window.userResize.afterWindow;
				
				if(	!_window) { return; }
				
				var _width = _window.width;
				var _height = _window.height;
				
				var _windowSize = {
					width: _width,
					height: _height
				}
				
				var _isReX = _window.userResize.reX;
				var _isReY = _window.userResize.reY;
				
				var _document = {
					width: window.innerWidth,
					height: window.innerHeight
				};
				
				var _parentNode = {
					width: _window.node.parentNode.clientWidth,
					height: _window.node.parentNode.clientHeight
				};
				
				var _start = {
					x: event.clientX,
					y: event.clientY
				}
				
				var _titleMargin;
				if( _window.isTitle) {
					_titleMargin = 61;
				} else {
					_titleMargin = 31;
				}
				
				var _MoveAction;
				switch( _window.userResize.location) {
				case 'left':
					_MoveAction = function(event) {
						var _newWidthWindow = _windowSize.width + event.clientX - _start.x;
						var _newWidthAfterWindow = _parentNode.width - _newWidthWindow -1;
						
						if(	event.clientX >= 0
							&& event.clientX < _document.width
							&& _newWidthWindow > _window.minWidth
						) {
							if( _afterWindow) {
								if( _newWidthAfterWindow <= _afterWindow.minWidth) {
									return false;
								} else {
									_afterWindow.width = _newWidthAfterWindow
								}
							}
							
							_width = _newWidthWindow;
							_window.width = _width;
							return true;
						}
						return false;
					};
					break;
				case 'top':
					_MoveAction = function(event) {
						if(	event.clientY >= 0
							&& event.clientY < _document.height
						) {
							_height = _windowSize.height + event.clientY - _start.y;
							_window.height = _height;
							return true;
						}
						return false;
					};
					break;
				case 'right':
					_MoveAction = function(event) {
						if(	event.clientX >= 0
							&& event.clientX < _document.width
						) {
							_width = _windowSize.width + ( (event.clientX - _start.x) * -1 );
							_window.width = _width;
							return true;
						}
						return false;
					};
					break;
				case 'bottom':
					_MoveAction = function(event) {
						var _newHeightWindow = _windowSize.height + ( (event.clientY - _start.y) * -1);
						
						if(	event.clientY >= 0
							&& event.clientY < _document.height
						) {
							if( _newHeightWindow <= _window.minHeight) {
								_newHeightWindow = _window.minHeight;
							}
							
							if( _afterWindow) {
								var _newHeightAfterWindow;
								_newHeightAfterWindow = _parentNode.height - _newHeightWindow - _titleMargin;
								
								if( _newHeightAfterWindow <= _afterWindow.minHeight) {
									_newHeightWindow = _parentNode.height - _afterWindow.minHeight - _titleMargin;
									_afterWindow.height = _afterWindow.minHeight;
								} else {
									_afterWindow.height = _newHeightAfterWindow;
								}
							}
							
							_height = _newHeightWindow;
							_window.height = _height;
							return true;
						}
						return false;
					};
					break;
				default:
					_MoveAction = function(event) {
						var _isCallback = false;
						if( _isReX
							&& event.clientX >= 0
							&& event.clientX < _document.width
						) {
							_width = _windowSize.width + event.clientX - _start.x;
							_window.width = _width;
							_isCallback = true;
						}
						
						if( _isReY
							&& event.clientY >= 0
							&& event.clientY < _document.height
						) {
							_height = _windowSize.height + event.clientY - _start.y;
							_window.height = _height;
							_isCallback = true;
						}
						
						return _isCallback;
					};
				}
				
				var _MoveCallback = param.evMove || function() {};
				
				var _OnMouseMove = function(event) {
					if( _MoveAction(event) ) {
						_MoveCallback( _width, _height);
					}
				};
				var _OnMouseUp = function() {
					document.removeEventListener("mousemove", _OnMouseMove);
					document.removeEventListener("mouseup", _OnMouseUp);
					
					if(param.evEnd) { param.evEnd( _width, _height); }
				};
				
				if(param.evStart) { param.evStart( _width, _height); }
				
				document.addEventListener("mousemove", _OnMouseMove);
				document.addEventListener("mouseup", _OnMouseUp);
				break;
				
			default:
				console.error('ERROR (grnch.MouseListener): event('+event+') is undefined (module: '+module+').');
				return;
			}
			
			break;
			
		default:
			console.error('ERROR (grnch.MouseListener): module('+module+') is undefined.');
			return;
		}
	},
	
	keyboard: {
		_stack: {},
		_press: {},
		
		_isActive: true,
		get active() {
			return this._isActive;
		},
		set active(val) {
			if( val == false) {
				this._press = {};
			}
			this._isActive = val;
		},
		
		Initialization: function() {
			document.body.addEventListener( 'keydown', function(event) {
				grnch.keyboard._keyDown(event);
			});
			
			document.body.addEventListener( 'keyup', function(event) {
				grnch.keyboard._keyUp(event);
			});
		},
		
		
		_keyDown: function(event) {
			if(grnch.keyboard.active) {
				var _key = event.which || event.keyCode;
				if ( _key != null) {
					var _stack = grnch.keyboard._stack[_key];
					if( _stack 
						&& (_stack.down || _stack._press)
					) {
						if( !grnch.keyboard._press[_key]) {
							grnch.keyboard._press[_key] = true;
							if( _stack.down) {
								if( _stack.down(event)) { return; }
							}
						} else {
							if( _stack.press) {
								if( !_stack.press(event)) { return; }
							}
						}
						
						event.preventDefault();
						return false;
					}
				}
				
			}
		},
		
		_keyUp: function(event) {
			if(grnch.keyboard.active) {
				var _key = event.which || event.keyCode;
				if (_key != null) {
					var _stack = grnch.keyboard._stack[_key];
					if( _stack) {
						delete grnch.keyboard._press[_key];
						if( _stack.up) {
							if( !_stack.up(event)) { return; }
						}
						return false;
					}
				}
			}
		},
		
		/*	param: {
				key: 'Number',
				down: 'function',
				press: 'function',
				up: 'function'
			}
		*/
		Add: function( param) {
			if(	param.key
				&& typeof(param.key) == 'number'
			//	&& param.key >= 32
			){
				grnch.keyboard._stack[param.key] = {};
				
				if( param.down
					&& typeof(param.down) == 'function'
				){
					grnch.keyboard._stack[param.key].down = param.down;
				}
				
				if( param.press
					&& typeof(param.press) == 'function'
				){
					grnch.keyboard._stack[param.key].press = param.press;
				}
				
				if( param.up
					&& typeof(param.up) == 'function'
				){
					grnch.keyboard._stack[param.key].up = param.up;
				}
			}
		},
		
		Remove: function( key) {
			if( grnch.keyboard._stack[key]) {
				delete grnch.keyboard._stack[key];
				
				if( grnch.keyboard._press[key]) {
					delete grnch._press._stack[key];
				}
			}
		}
		
	}
};

grnch._Animator();


var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];

for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	window.requestAnimationFrame = 	window[vendors[x]+'RequestAnimationFrame'];
	window.cancelAnimationFrame = 	window[vendors[x]+'CancelAnimationFrame'] 
									|| window[vendors[x]+'CancelRequestAnimationFrame'];
}
if (!window.requestAnimationFrame)
	window.requestAnimationFrame = function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
		
		lastTime = currTime + timeToCall;
		return id;
	};
if (!window.cancelAnimationFrame)
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}());





(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
			|| window[vendors[x]+'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());