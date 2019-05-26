(function() {
'use strict'

ave.docReady = function() {
// Blackout
	ave.bars.blackout = new grnch.Window({
		id: 'ave-blackout',
		isActive: false,
		
		comment: '(ave.docReady) create blackout.'
	});
	
	ave.bars.blackoutNull = new grnch.Window({
		id: 'ave-blackoutNull',
		isActive: false,
		
		comment: '(ave.docReady) create blackoutNull.'
	});
			
// Context Menu			
	ave.bars.contextMenu = {
		node: document.getElementById('ave-contextMenu'),
		
		children: {
			layersList: document.getElementById('ave-cmBlock-layersList'),
			layersListItem: document.getElementById('ave-cmBlock-layersListItem')
		},
		
		_blockActive: undefined,
		_callback: undefined,
		
		Open: function( block, event) {
			var _this = ave.bars.contextMenu;
			if( _this._blockActive) { return; }
				
			switch( block) {
			case 'layersList': 
				_this._blockActive = _this.children.layersList;
				_this._callback = function() {
					ave.controller.layersList._contextMenu.element = undefined;
				};
				break;
			case 'layersListItem': 
				_this._blockActive = _this.children.layersListItem;
				_this._callback = function() {
					ave.controller.layersList._contextMenu.element = undefined;
				};
				break;
			default:
				return;
			}
			
			_this._blockActive.style.display = 'block';
			
			_this.node.style.display = 'block';
			if(event.clientX < window.innerWidth/2) {
				_this.node.style.marginLeft = event.clientX+'px';
			} else {
				_this.node.style.marginLeft = (event.clientX - _this._blockActive.clientWidth)+'px';
			}
			if(event.clientY < window.innerHeight/2) {
				_this.node.style.marginTop = event.clientY+'px';
			} else {
				_this.node.style.marginTop = (event.clientY - _this._blockActive.clientHeight)+'px';
			}
			
			ave.bars.blackoutNull.show();
			ave.bars.blackoutNull.node.addEventListener('mousedown', _this.Close)
			
		},
		
		Close: function() {
			var _this = ave.bars.contextMenu;
			
			if( _this._callback) {
				_this._callback();
			}
			
			if( _this._blockActive) {
				_this._blockActive.style.display = 'none';
				_this._blockActive = undefined;
			}
			
			_this.node.style.display = 'none';
			ave.bars.blackoutNull.hide();
			ave.bars.blackoutNull.node.removeEventListener('mousedown', _this.Close)
			
		},
		
	};
	
// Toolbar
	ave.bars.toolbar = {
		children: {
			Hand: {
				button: document.getElementById('ave-handTool'),
				options: document.getElementById('ave-optionsToolBar-handTool')
			},
			Move: {
				button: document.getElementById('ave-moveTool'),
				options: document.getElementById('ave-optionsToolBar-moveTool'),
				modes: {
					Move: document.getElementById('ave-optionsToolBar-moveTool-move'),
					Select: document.getElementById('ave-optionsToolBar-moveTool-select')
				}
			},
			Pen: {
				button: document.getElementById('ave-penTool'),
				options: document.getElementById('ave-optionsToolBar-penTool'),
				modes: {
					Create: document.getElementById('ave-optionsToolBar-penTool-create'),
					AddOrDel: document.getElementById('ave-optionsToolBar-penTool-addAndRemove')
				}
			},
			Edit: {
				button: document.getElementById('ave-editTool'),
				options: document.getElementById('ave-optionsToolBar-editTool'),
				modes: {
					Move: document.getElementById('ave-optionsToolBar-editTool-move'),
					Select: document.getElementById('ave-optionsToolBar-editTool-select'),
					Curves: document.getElementById('ave-optionsToolBar-editTool-curves')
				}
			},
			Select: {
				button: document.getElementById('ave-selectTool'),
				options: document.getElementById('ave-optionsToolBar-selectTool'),
				modes: {
					Default: document.getElementById('ave-optionsToolBar-selectTool-default'),
					Add: document.getElementById('ave-optionsToolBar-selectTool-add'),
					Remove: document.getElementById('ave-optionsToolBar-selectTool-remove'),
				}
			},
			Transform: {
				button: document.getElementById('ave-transformTool'),
				options: document.getElementById('ave-optionsToolBar-transformTool'),
				// modes: {
					// Default: document.getElementById('ave-optionsToolBar-transformTool-default'),
				// }
			},
			
			graphic: {
				fill: document.getElementById('ave-optionsToolBar-graphic-fill'),
				stroke: document.getElementById('ave-optionsToolBar-graphic-stroke'),
				strokeWidth: document.getElementById('ave-optionsToolBar-graphic-strokeWidth'),
			}
		}
	};
	
	ave.controller.scene.tools.transform.anchor.node = document.getElementById('ave-svgAnchor');
	

// LayersList
	var _layerListContentArea = document.getElementById('ave-layersList-area');
	
	ave.bars.layersList = new grnch.Window({
		id: 'ave-layersList-bar',
		title: 'Layers',
		isActive: true,
		width: 280,
		minWidth: 150,
		children: {
			path: 'ave-layerList-path',
			list: 'ave-layerList-content'
		},
		// userResize: {
			// location: 'right',
			// callback: {
				// move: function( width, height) {
					// ave.bars.editorBlockLeft.width = window.innerWidth - width -1;
					// ave.bars.scene.workSpace._RePosition();
				// }
			// }
		// },
		
		comment: '(ave.docReady) create layersList.'
	});
	
	ave.bars.layersList.children.list.addEventListener('mousedown', ave.controller.layersList.OnMouseDown);
	
// SVG Load Bar
	ave.bars.svgLoad = new grnch.Window({
		id: 'ave-svgLoadBar',
		isActive: false,
		children: {
			textarea: 'ave-svgLoadTextarea',
			status: 'ave-svgLoadStatus'
		},
		
		comment: '(ave.docReady) create svgLoadBar.'
	});	
	
// SVG Save Bar
	ave.bars.svgSave = new grnch.Window({
		id: 'ave-svgSaveBar',
		isActive: false,
		children: {
			textarea: 'ave-svgSaveTextarea'
		},
		
		comment: '(ave.docReady) create svgSaveBar.'
	});	
	
// Anim Load Bar
	ave.bars.animLoad = new grnch.Window({
		id: 'ave-animLoadBar',
		isActive: false,
		children: {
			textarea: 'ave-animLoadTextarea',
			status: 'ave-animLoadStatus'
		},
		
		comment: '(ave.docReady) create animLoadBar.'
	});	
	
// Anim Save Bar
	ave.bars.animSave = new grnch.Window({
		id: 'ave-animSaveBar',
		isActive: false,
		children: {
			textarea: 'ave-animSaveTextarea'
		},
		
		comment: '(ave.docReady) create animSaveBar.'
	});	
	
// Web Save Bar
	ave.bars.webSave = new grnch.Window({
		id: 'ave-webSaveBar',
		isActive: false,
		children: {
			textarea: 'ave-webSaveTextarea'
		},
		
		comment: '(ave.docReady) create webSaveBar.'
	});
	
// Animation Settings
	ave.bars.animSettings = new grnch.Window({
		id: 'ave-animationSettingsBar',
		isActive: false,
		// children: {
			// textarea: 'ave-svgLoadTextarea',
			// status: 'ave-svgLoadStatus'
		// },
		
		comment: '(ave.docReady) create AnimSettings.'
	});
	
// Editor Block 1
	ave.bars.editorBlockLeft = new grnch.Window({
		id: 'ave-editorBlockLeft',
		isActive: true,
		adaptive:true,
		width: window.innerWidth - ave.bars.layersList.width -1,
		minWidth: 200,
		userResize: {
			location: 'left',
			afterWindow: ave.bars.layersList,
			callback: {
				move: function( width, height) {
					// ave.bars.layersList.width = window.innerWidth - width -1;
					ave.bars.scene.workSpace._RePosition();
				}
			}
		},
		
		comment: '(ave.docReady) create block 1.'
	});
	
// Scene
	ave.bars.scene.workSpace = {
		_label: {
			layerPath: {
				strokeWidth: 2
			},
			point: {
				node: document.getElementById('ave-svgPoint'),
				r: 3.5,
				strokeWidth: 2
			},
			animPoint: {
				node: document.getElementById('ave-svgAnimPoint'),
				r: 3.5,
				strokeWidth: 2
			},
			pointActive: {
				node: document.getElementById('ave-svgPointActive'),
				r: 3.5,
				strokeWidth: 2
			},
			supPoint: {
				node: document.getElementById('ave-svgSupPoint'),
				r: 3,
				strokeWidth: 1
			},
			animSupPoint: {
				node: document.getElementById('ave-svgAnimSupPoint'),
				r: 3,
				strokeWidth: 1
			},
			supPolyline: {
				strokeWidth: 1
			},
			itemPath: {
				strokeWidth: 7
			},
			anchor: {
				nodes: {
					circle: document.getElementById('ave-svgAnchor-circle'),
					line1: document.getElementById('ave-svgAnchor-line1'),
					line2: document.getElementById('ave-svgAnchor-line2')
				},
				r: 4,
				strokeWidth: 1,
				lineLength: 7
			}
		},
		
		_RePosition: function() {},
		_SetViewBow: function() {
			this.node.setAttributeNS(null, 'viewBox', '0 0 '+this.viewBox.width+' '+this.viewBox.height);
		},
		
		node: document.getElementById('ave-svgWorkSpace'),
		position: {
			x: 0,
			y: 0
		},
		Move: function() {
			// this.node.style['-webkit-transform'] = 'translate3d( '+this.position.x+'px, '+this.position.y+'px, 0)'
			this.node.style.marginLeft = this.position.x+'px';
			this.node.style.marginTop = this.position.y+'px';
		},
		
		viewBox: {
			_width: 550,
			get width() {
				return this._width;
			},
			set width(val) {
				this._width = val;
				this._SetViewBow();
			},
			
			_height: 400,
			get height() {
				return this._height;
			},
			set height(val) {
				this._height = val;
				this._SetViewBow();
			}
		},
		
		_width: 550,
		get width() {
			return this._width;
		},
		set width(val) {
			this._width = val*this.zoom;
			this.node.style.width = val*this.zoom + 'px';
		},
		
		_height:400,
		get height() {
			return this._height;
		},
		set height(val) {
			this._height = val*this.zoom;
			this.node.style.height = val*this.zoom + 'px';
		},
		
		_zoom: 1,
		get zoom() {
			return this._zoom;
		},
		set zoom(val) {
			if( val <= 5 && val >= 0.5) {
				this._zoom = val;
				
				this.width = this.viewBox.width;
				this.height = this.viewBox.height;
				
				var _item = this._label.point;
				_item.node.setAttributeNS(null, 'r', _item.r/this.zoom);
				_item.node.setAttributeNS(null, 'stroke-width', _item.strokeWidth/this.zoom);
				
				var _item = this._label.animPoint;
				_item.node.setAttributeNS(null, 'r', _item.r/this.zoom);
				_item.node.setAttributeNS(null, 'stroke-width', _item.strokeWidth/this.zoom);
				
				_item = this._label.pointActive;
				_item.node.setAttributeNS(null, 'r', _item.r/this.zoom);
				_item.node.setAttributeNS(null, 'stroke-width', _item.strokeWidth/this.zoom);
				
				_item = this._label.supPoint;
				_item.node.setAttributeNS(null, 'r', _item.r/this.zoom);
				_item.node.setAttributeNS(null, 'stroke-width', _item.strokeWidth/this.zoom);
				
				_item = this._label.animSupPoint;
				_item.node.setAttributeNS(null, 'r', _item.r/this.zoom);
				_item.node.setAttributeNS(null, 'stroke-width', _item.strokeWidth/this.zoom);
				
				_item = this._label;
				this.children.svgLayersPath.setAttributeNS(null, 'stroke-width', _item.layerPath.strokeWidth/this.zoom);
				this.children.svgAnimPath.setAttributeNS(null, 'stroke-width', _item.layerPath.strokeWidth/this.zoom);
				this.children.svgItemsPath.setAttributeNS(null, 'stroke-width', _item.itemPath.strokeWidth/this.zoom);
				this.children.svgItemsAnimPath.setAttributeNS(null, 'stroke-width', _item.itemPath.strokeWidth/this.zoom);
				this.children.svgLayers.setAttributeNS(null, 'stroke-width', _item.supPolyline.strokeWidth/this.zoom);
				this.children.svgAnimLabels.setAttributeNS(null, 'stroke-width', _item.supPolyline.strokeWidth/this.zoom);
				
				_item = this._label.anchor;
				_item.nodes.circle.setAttributeNS(null, 'r', _item.r/this.zoom);
				_item.nodes.circle.setAttributeNS(null, 'stroke-width', _item.strokeWidth/this.zoom);
				_item.nodes.line1.setAttributeNS(null, 'stroke-width', _item.strokeWidth/this.zoom);
				_item.nodes.line2.setAttributeNS(null, 'stroke-width', _item.strokeWidth/this.zoom);
				
				var _p = _item.lineLength/this.zoom;
				_item.nodes.line1.setAttributeNS(null, 'points', '0,-'+_p+' 0,'+_p+'');
				_item.nodes.line2.setAttributeNS(null, 'points', '-'+_p+',0 '+_p+',0');
				
			}
		},
		
		children: {
			svgContent: document.getElementById('ave-svgContent'),
			svgLayersPath: document.getElementById('ave-svgLayersPath'),
			svgAnimPath: document.getElementById('ave-svgAnimPath'),
			svgItemsPath: document.getElementById('ave-svgItemsPath'),
			svgItemsAnimPath: document.getElementById('ave-svgItemsAnimPath'),
		//	svgLabels: document.getElementById('ave-svgLabels'),
			svgLayers: document.getElementById('ave-svgLayers'), 
			svgAnimLabels: document.getElementById('ave-svgAnim'),
			svgSelectArea: document.getElementById('ave-svgSelectArea')
		}
	};
	ave.bars.scene.workSpace._SetViewBow();
	
	ave.bars.scene.window = new grnch.Window({
		id: 'ave-svgScene',
		title: 'Scene',
		isActive: true,
		adaptive: true,
		children: {
			svgArea: 'ave-svgArea',
			sceneLock: 'ave-sceneLock'
		},
		// userResize: {
			// location: 'top',
			// callback: {
				// move: function( width, height) {
					// ave.bars.animation.window.height = ave.bars.editorBlockLeft.height - height -61;
					// ave.bars.scene.workSpace._RePosition();
				// }
			// }
		// },
		
		comment: '(ave.docReady) create scene.'
	});
	
	ave.bars.scene.window.children.sceneLock.addEventListener("mousedown", ave.controller.scene.tools.hand.HandEvent );
	
	ave.bars.scene.workSpace._RePosition = function() {
		var _isChang = false;
		var _window = ave.bars.scene.window;
		
		var _winWidth = _window.node.clientWidth;
		
		if( this.width < _winWidth) {
			this.position.x = ( (_winWidth-this.width)/2 );
			_isChang = true;
		}
		
		if( this.height < _window.height) {
			this.position.y = ( (_window.height-this.height)/2 );
			_isChang = true;
		}
		
		if( _isChang) {
			this.Move();
		}
		
	}
	
	ave.bars.scene.workSpace._RePosition();
	
	ave.bars.scene.workSpace.node.addEventListener('mousedown', ave.controller.scene.OnMouseDown);
	
// Animation
	ave.bars.animation.window = new grnch.Window({
		id: 'ave-animation',
		// title: 'Animation',
		isActive: true,
		minHeight: 30,
		children: {
			timeBlock: 'ave-animationTimeBlock'
		},
		userResize: {
			location: 'bottom',
			afterWindow: ave.bars.scene.window,
			callback: {
				move: function( width, height) {
					ave.bars.scene.workSpace._RePosition();
				}
			}
		},
		
		comment: '(ave.docReady) create animation.'
	});
	ave.bars.animation.blockLeft = new grnch.Window({
		id: 'ave-animationBlockLeft',
		isActive: true,
		children: {
			optionSeeImg: 'ave-animation-options-seeImg',
			itemsList: 'ave-animation-itemsList'
		},
		userResize: {
			location: 'left',
			afterWindow: ave.bars.animation.blockRight
			// callback: {
				// move: function( width, height) {
					// ave.bars.animation.blockRight.node.style.width = 'calc(100% - '+(width+1)+'px)';
				// }
			// }
		},
		
		comment: '(ave.docReady) create animation blockLeft.'
	});
	ave.bars.animation.blockRight = new grnch.Window({
		id: 'ave-animationBlockRight',
		isActive: true,
		adaptive: true,
		children: {
			timelineContainer: 'ave-animation-timeline-container',
			svgTimeline: 'ave-animation-timeline',
			timelineGroup: 'ave-timeline-group',
			timeCursor: 'ave-timeline-cursorObj',
			itemsArea: 'ave-animation-itemsArea'
		},
		// userResize: {
			// location: 'right',
			// callback: {
				// move: function( width, height) {
					// ave.bars.animation.blockLeft.width = ave.bars.animation.window.width - width -1;
					
				// }
			// }
		// },
		
		comment: '(ave.docReady) create animation blockLeft.'
	});
	
	var _animation = ave.animation;
	var _timelineScroll = 0;
	
	ave.bars.animation.blockLeft.children.itemsList.addEventListener("mousedown", ave.controller.animation.itemsList.OnMouseDown);
	ave.bars.animation.blockRight.children.itemsArea.addEventListener("mousedown", ave.controller.animation.timeline.OnMouseDown);
	
	ave.bars.animation.blockRight.children.svgTimeline.addEventListener("mouseover", function( event) {
		ave.bars.animation.window.children.timeBlock.style.display = 'block';
	});
	
	ave.bars.animation.blockRight.children.svgTimeline.addEventListener("mouseout", function( event) {
		ave.bars.animation.window.children.timeBlock.style.display = 'none';
		
		_animation._currTimePos = _animation.cursor;
	});
	
	ave.bars.animation.blockRight.children.svgTimeline.addEventListener("mousemove", function( event) {
		ave.bars.animation.window.children.timeBlock.style.left = event.clientX+'px';
		
		var _timelineContainer = ave.bars.animation.blockRight.children.timelineContainer;
		
		var _timePos = parseInt( (event.layerX+_timelineScroll-5)/10 );
		if( _timePos < 0) _timePos = 0;
		if( _timePos != _animation._currTimePos) {
			_animation._currTimePos = _timePos;
			ave.bars.animation.window.children.timeBlock.innerHTML = _timePos;
		}
		
	});
	
	ave.bars.animation.blockRight.children.svgTimeline.addEventListener("click", ave.animation.ClickTimeline);
	ave.bars.animation.blockRight.children.itemsArea.addEventListener("scroll", function() {
		ave.bars.animation.blockLeft.children.itemsList.scrollTop = this.scrollTop;
	});
	
	ave.bars.handArea = new grnch.Window({
		id: 'ave-animation-handArea',
		isActive: false,
		
		comment: '(ave.docReady) create blackout.'
	});
	
	ave.bars.handArea.node.addEventListener('mousedown', function(event) {
		var _timelineContainer = ave.bars.animation.blockRight.children.timelineContainer;
		var _itemsArea = ave.bars.animation.blockRight.children.itemsArea;
		
		var _startPos = event.screenX;
		var _startScroll = _timelineContainer.scrollLeft;
		
		var _MouseMove = function(event) {
			var _vec = _startPos - event.screenX + _startScroll;
			
			_timelineContainer.scrollLeft = _vec;
			_itemsArea.scrollLeft = _vec;
		};
		
		var _MouseUp = function() {
			_timelineScroll = _timelineContainer.scrollLeft;
			
			document.removeEventListener("mousemove", _MouseMove);
			document.removeEventListener("mouseup", _MouseUp);
		};
		
		document.addEventListener("mousemove", _MouseMove);
		document.addEventListener("mouseup", _MouseUp);
		
	});
	
	ave.animation.GeneretaTimeline();
			
// Keyboard Event
	grnch.keyboard.Initialization();
	// Space
	grnch.keyboard.Add({
		key: 32,
		down: function() {
			if(ave.controller.scene.tools.mode == 'Hand') return;
			
			ave.bars.scene.window.children.sceneLock.style['display'] = 'block';
			// ave.bars.scene.window.children.sceneLock.addEventListener("mousedown", ave.controller.scene.tools.hand.HandEvent );
			ave.bars.handArea.show();
			
			return true;
		},
		up: function() {
			if(ave.controller.scene.tools.mode == 'Hand') return;
			
			ave.bars.scene.window.children.sceneLock.style['display'] = '';
			// ave.bars.scene.window.children.sceneLock.removeEventListener("mousedown", ave.controller.scene.tools.hand.HandEvent );
			ave.bars.handArea.hide();
			
			return true;
		}
	});
	// Alt
	grnch.keyboard.Add({
		key: 18,
		down: function() {
			var _scene = ave.controller.scene;
			_scene._param.switchToOneCurve = true;
			_scene.tools.edit.mode = 'Curves';
			
			return true;
		},
		up: function() {
			var _scene = ave.controller.scene;
			_scene._param.switchToOneCurve = false;
			_scene.tools.edit.mode = 'Move';
			
			return true;
		}
	});
	// Ctrl
	grnch.keyboard.Add({
		key: 17,
		down: function() {
			var _tools = ave.controller.scene.tools;
			
			switch(_tools.mode) {
			case 'Move':
				_tools.move.mode = 'Select';
				break;
			case 'Pen':
				_tools.pen.mode = 'AddOrDel';
				break;
			case 'Edit':
				_tools.edit.mode = 'Select';
				break;
			}	
			return true;
		},
		up: function() {
			var _tools = ave.controller.scene.tools;
			
			switch(_tools.mode) {
				case 'Move':
					_tools.move.mode = 'Move';
					break;
				case 'Pen':
					_tools.pen.mode = 'Create';
					break;
				case 'Edit':
					_tools.edit.mode = 'Move';
					break;
			}
			return true;
		}
	});
	// Z
	grnch.keyboard.Add({
		key: 90,
		up: function( event) {
			if(	event.ctrlKey) {
				ave.history.Cancel();
				return true;
			}
			
			if(	event.altKey) {
				ave.history.Repeat();
				return true;
			}
			
			return false;
		}
	});
	// V
	grnch.keyboard.Add({
		key: 86,
		up: function( event) {
			ave.controller.scene.tools.mode = 'Edit';
			return true;
		}
	});
	// F
	grnch.keyboard.Add({
		key: 70,
		up: function( event) {
			ave.controller.scene.tools.mode = 'Pen';
			return true;
		}
	});
	// M
	grnch.keyboard.Add({
		key: 77,
		up: function( event) {
			ave.controller.scene.tools.mode = 'Move';
			return true;
		}
	});
	
// Zoom Event
	var _ZoomEvent = function(event) {
		var _event = event || window.event;

		var _delta = _event.deltaY || _event.detail || _event.wheelDelta;
		
		var _offSetX = ave.bars.scene.window.node.offsetLeft;
		var _offSetY = ave.bars.scene.window.node.offsetTop;
		
		var _posX = (event.clientX-_offSetX-ave.bars.scene.workSpace.position.x)/ave.bars.scene.workSpace.zoom/ave.bars.scene.workSpace.viewBox.width;
		var _posY = (event.clientY-_offSetY-ave.bars.scene.workSpace.position.y)/ave.bars.scene.workSpace.zoom/ave.bars.scene.workSpace.viewBox.height;
		
		var _workWidth = ave.bars.scene.workSpace.width;
		var _workHeight = ave.bars.scene.workSpace.height;
		
		if( _delta > 0) {
			ave.controller.scene.zoom.minus();
			
			_posX = (_workWidth-ave.bars.scene.workSpace.width)*_posX;
			_posY = (_workHeight-ave.bars.scene.workSpace.height)*_posY;
			
			ave.bars.scene.workSpace.position.x += _posX;
			ave.bars.scene.workSpace.position.y += _posY;
		} else 
		if( _delta < 0) {
			ave.controller.scene.zoom.plus();
			
			_posX = (_workWidth-ave.bars.scene.workSpace.width)*_posX;
			_posY = (_workHeight-ave.bars.scene.workSpace.height)*_posY;
			
			ave.bars.scene.workSpace.position.x += _posX;
			ave.bars.scene.workSpace.position.y += _posY;
		}
		
		
		ave.bars.scene.workSpace.Move();
		
	};
	ave.bars.scene.window.node.addEventListener("wheel", _ZoomEvent );
	
// Right mouse button event
	document.addEventListener( 'contextmenu', function(event) {
		event.preventDefault();
		return false;
	});
	
	// ave.controller.scene.tools.mode = 'Pen';
	ave.controller.layersList.button.Layer();
	
	ave.animation.EyeAnimSvgElement();
};
})();