(function() {
'use strict'

ave.controller = {
	_prefab: {
		PositOfHierarchy: function() {
			var _hierarchy = [];
					
			var _IndOfParent = function( element) {
				if( element._parent == undefined) {
					return [ ave.hierarchy.items.indexOf( element) ];
				} else {
					var _parentsList = _IndOfParent( element._parent);
					_parentsList.push( element._parent.items.indexOf( element) );
					return _parentsList;
				}
			};
				
			if( ave.edit._layers.length == 0) {} 
			else {
				ave.edit._layers.forEach( function( layer) {
					var _parentsList = _IndOfParent( layer );
					
					var _currPosit = _hierarchy;
					
					for(var parentInd=0, parentLen=_parentsList.length; parentInd<parentLen; parentInd++) {
						
						if(parentInd == parentLen-1) {
							_currPosit[ _parentsList[parentInd] ] = layer;
							continue;
						}
						
						if( !_currPosit[ _parentsList[parentInd] ]) {
							_currPosit[ _parentsList[parentInd] ] = [];
						}
						_currPosit = _currPosit[ _parentsList[parentInd] ];
						
					}
				});
				
			}	
			
			if( ave.edit._groups.length == 0) {} 
			else {
				ave.edit._groups.forEach( function( group) {
					var _parentsList = _IndOfParent( group );
					
					
					var _currPosit = _hierarchy;
					for(var parentInd=0, parentLen=_parentsList.length; parentInd<parentLen; parentInd++) {
						if(parentInd == parentLen-1) {
							_currPosit[ _parentsList[parentInd] ] = group;
							if(	group._isFolder) {
								group.FolderEvent();
							}
							continue;
						}
						
						if( !_currPosit[ _parentsList[parentInd] ]) {
							_currPosit[ _parentsList[parentInd] ] = [];
						} else { return; }
						
						_currPosit = _currPosit[ _parentsList[parentInd] ];
						
					}
				});
				
			}
			
			return _hierarchy;
		}
		
	},
	
	project: {
		svg: {
			OnLoad: function() {
				var _val = ave.bars.svgLoad.children.textarea.value;
				
				if(!_val) {
					ave.bars.svgLoad.children.status.innerHTML = 'Write svg in textarea.';
				} else {
					var _Error = function() {
						ave.bars.svgLoad.children.status.innerHTML = 'ERROR: Invalid SVG.';
					}
					
					var _prefElement = document.createElement('div');
					
					try {  
						_prefElement.innerHTML = _val;
						
						if(	_prefElement.children[0].nodeName != 'svg'
							&& !_prefElement.children[0].children.length
						){
							_Error();
							return;
						}
						
						var _svgElement = _prefElement.children[0];
						
						var _newWidth = Number( _svgElement.getAttributeNS(null, 'width') );
						if( _newWidth ) {
							ave.bars.scene.workSpace.width = _newWidth;
						}
						
						var _newHeight = Number( _svgElement.getAttributeNS(null, 'height') );
						if( _newHeight ) {
							ave.bars.scene.workSpace.height = _newHeight;
						}
						
						ave.bars.scene.workSpace._RePosition();
						
						var _parentGroup = [];
						
						var _Production = function( pathList) {
							for(var i=0, listLen=pathList.length; i<listLen; i++) {
								if( pathList[i].nodeName == 'g') {
									var _group = new ave.prefabs.Group( pathList[i].id);
									
									// Group add style
									var _fill = pathList[i].getAttributeNS(null, 'fill');
									if( _fill) {
										_group.style.fill = _fill;
									}
									
									var _stroke = pathList[i].getAttributeNS(null, 'stroke');
									if( _stroke) {
										_group.style.stroke = _stroke;
									}
									
									var _strokeWidth = pathList[i].getAttributeNS(null, 'stroke-width');
									if( _strokeWidth) {
										_group.style.strokeWidth = _strokeWidth;
									}
									
									_group.InsertTo( 0, _parentGroup[_parentGroup.length-1]);
									_parentGroup.push( _group);
									_Production( pathList[i].children);
									_parentGroup.splice( _parentGroup.length-1, 1);
									continue;
								}
								
								if( pathList[i].nodeName != 'path') {
									console.warn('WARN (ave.controller.project.svg.OnLoad): SVG element('+(i+1)+') is not "path".');
									continue;
								}
								
								// Create layer
								var _layer = new ave.prefabs.Layer( pathList[i].id);
								_layer.InsertTo( 0, _parentGroup[_parentGroup.length-1]);
								
								// Layer add style
								var _fill = pathList[i].getAttributeNS(null, 'fill');
								if( _fill) {
									_layer.style.fill = _fill;
								}
								
								var _stroke = pathList[i].getAttributeNS(null, 'stroke');
								if( _stroke) {
									_layer.style.stroke = _stroke;
								}
								
								var _strokeWidth = pathList[i].getAttributeNS(null, 'stroke-width');
								if( _strokeWidth) {
									_layer.style.strokeWidth = _strokeWidth;
								}
								
								// ---
								var _d = pathList[i].getAttribute('d');
								if(!_d) {
									console.warn('WARNING (ave.controller.project.svg.OnLoad): SVG path('+(i+1)+') attribute "d" is not found.');
									continue;
								}
								
								var _dChar = [];
								for(var i2=0, dLen=_d.length; i2<dLen; i2++) {
									_dChar[i2] = _d[i2];
								}
								
								for(var j=0, len=_dChar.length; j<len; j++) {
									if( j == 0) {
										if(	_dChar[1] == 'M'
											&& _dChar[0] == ' '
										){
											_dChar.splice( 0, 1);
										}
										
										if(	_dChar[0] == 'M'
											&& _dChar[1] != ' '
										){
											_dChar.splice( 1, 0, ' ');
										}
										
										continue;
									}
									
									if( _dChar[j] == 'M'
										|| _dChar[j] == 'L'
										|| _dChar[j] == 'Q'
										|| _dChar[j] == 'C'
										
										|| _dChar[j] == 'm'
										|| _dChar[j] == 'l'
										|| _dChar[j] == 'q'
										|| _dChar[j] == 'c'
									){
										if( _dChar[j-1] != ' ') {
											_dChar.splice( j-1, 0, ' ');
										}
										if( _dChar[j+1] != ' ') {
											_dChar.splice( j+1, 0, ' ');
										}
									} else
									if( _dChar[j] == ',') {
										_dChar[j] = ' ';
									}
									
								}
								
								_d = '';
								for(var i2=0, dLen=_dChar.length; i2<dLen; i2++) {
									_d += _dChar[i2];
								}
								
								var _parser = _d.split(' ');
								
								var _pathSEGList = [];
								var _prePoint = {};
								for(var j2=0, len2=_parser.length; j2<len2; j2++) {
									if( _parser[j2] == 'l'
										|| _parser[j2] == 'q'
										|| _parser[j2] == 'c'
									){
										var _sup = 1;
										switch( _parser[j2]) {
											case 'c':
												_parser[j2+_sup++] += _prePoint.x;
												_parser[j2+_sup++] += _prePoint.y;
											case 'q':
												_parser[j2+_sup++] += _prePoint.x;
												_parser[j2+_sup++] += _prePoint.y;
											case 'l':
												_parser[j2+_sup++] += _prePoint.x;
												_parser[j2+_sup++] += _prePoint.y;
												break;
										}
										
										_parser[j2] = _parser[j2].toUpperCase();
									}
									
									if(	_parser[j2] == 'M'
										|| _parser[j2] == 'L'
										|| _parser[j2] == 'Q'
										|| _parser[j2] == 'C'
									){
										var _param = {};
										
										_param.type = _parser[j2];
										
										var _sup = 1;
										switch(_parser[j2]) {
										case 'C':
											_param.x2 = Number( _parser[j2+_sup++] );
											_param.y2 = Number( _parser[j2+_sup++] );
										case 'Q':
											_param.x1 = Number( _parser[j2+_sup++] );
											_param.y1 = Number( _parser[j2+_sup++] );
										case 'M':
										case 'L':
											_param.x = Number( _parser[j2+_sup++] );
											_param.y = Number( _parser[j2+_sup++] );
											
											_prePoint.x = _param.x;
											_prePoint.y = _param.y;
											break;
										}
										
										_pathSEGList.push(_param);
									}
								}
								
								var _AfterPoint = function( pointInd) {
									var _item = _pathSEGList[pointInd+1];
									if( !_item) { return undefined; }
									
									var _point0 = {
										x: _pathSEGList[pointInd].x,
										y: _pathSEGList[pointInd].y
									};
									
									switch( _item.type ) {
									case 'C':
										return { x: _item.x2, y: _item.y2 };
									case 'Q': 
										return { 
											x: ( _point0.x + ( 2*(_item.x1 - _point0.x) ) / 3 ), 
											y: ( _point0.y + ( 2*(_item.y1 - _point0.y) ) / 3 )
										};
									default:
										return undefined;
									}
								};
								
								for(var segInd=0, segLen=_pathSEGList.length; segInd<segLen; segInd++) {
									var _item = _pathSEGList[segInd];
									var _param = {};
									
									switch( _item.type) {
									case 'C': 
									case 'Q':
										if( _item.type == 'Q') {
											_param.x1 = _item.x1 + (_item.x - _item.x1) / 3;
											_param.y1 = _item.y1 + (_item.y - _item.y1) / 3;
										} else {
											_param.x1 = _item.x1;
											_param.y1 = _item.y1;
										}
									case 'L':
									case 'M':
										_param.x = _item.x;
										_param.y = _item.y;
										break;
									}
									
									var _afterSupPoint = _AfterPoint(segInd);
									if( _afterSupPoint) {
										_param.x2 = _afterSupPoint.x;
										_param.y2 = _afterSupPoint.y;
									}
									
									var _item = new ave.prefabs.LayerItem( _param);
									_layer.AppendItem(_item);
								}
								
								_layer._PathBuild();
							}
						}
						
						_Production(_svgElement.children);
						
					} catch( err) {
						_Error();
						console.log(err);
						return;
					}
					
					// ave.bars.svgLoad.children.status.innerHTML = 'Complet!';
					ave.controller.project.svg.CloseLoadBar();
				}
				
			},
			OpenLoadBar: function() {
				ave.bars.blackout.show();
				ave.bars.svgLoad.show();
			},
			CloseLoadBar: function() {
				ave.bars.svgLoad.hide();
				ave.bars.blackout.hide();
			},
			
			OpenSaveBar: function() {
				var _viewBox = ave.bars.scene.workSpace.viewBox;
				
				var _svg = document.createElementNS( ave._xmlns, 'svg');
				_svg.setAttributeNS(null, 'viewBox', '0 0 '+_viewBox.width+' '+_viewBox.height);
				
				var _hierarchy = ave.hierarchy.items;
				
				var _CheckGroup = function( items, svgElem) {
					items.forEach(function( item) {
						switch(item.type) {
						case 'Group':
							var _group = document.createElementNS( ave._xmlns, 'g');
							_group.setAttributeNS(null, 'id', item.id);
							_CheckGroup(item.items, _group);
							
							svgElem.appendChild(_group);
							break;
						case 'Layer':
							var _path = item.nodes.scene.content.cloneNode();
							_path.setAttribute('id', item.id);
							svgElem.appendChild(_path);
							break;
						}
					});
					
				};
				
				_CheckGroup( _hierarchy, _svg);
				
				ave.bars.svgSave.children.textarea.value = _svg.outerHTML;
				
				ave.bars.blackout.show();
				ave.bars.svgSave.show();
			},
			CloseSaveBar: function() {
				ave.bars.blackout.hide();
				ave.bars.svgSave.hide();
			}
		},

		animation: {
			OnLoad: function(animTxt) {
				var json;
				
				if(animTxt) {
					json = animTxt;
				} else {
					json = ave.bars.animLoad.children.textarea.value;
				}
				var _load = JSON.parse(json);
			
				for(var layerId in _load) {
					var _layer = ave.layersList.items[layerId];
					
					for(var item in _load[layerId]) {
						var _item = _layer.items[ Number(item) ];
					
						if( _item.animPath == undefined) {
							_item.animPath = new ave.prefabs.animPath.LayerItem({
								item: _item
							});
						}
						
						for(var point in _load[layerId][item]) {
							var _point = _item.points[ Number(point) ];
							
							if(	_point.animPath == undefined) {
								_point.animPath = new ave.prefabs.animPath.LayerItemPoint({
									point: _point
								});
								
							}
							
							for(var frame in _load[layerId][item][point]) {
								var _frame = Number(frame);
								
								_point.animPath.AddFrame({
									frame: _frame,
									x: _load[layerId][item][point][frame][0].x,
									y: _load[layerId][item][point][frame][0].y
								});
								
								if( _load[layerId][item][point][frame][1].x != undefined) {
									
									_point.animPath.frames[_frame ].points[1].isActive = true;
									_point.animPath.frames[_frame ].points[2].isActive = true;
									
									_point.animPath.frames[_frame].points[1].MoveTo( 
										_load[layerId][item][point][frame][1].x,
										_load[layerId][item][point][frame][1].y
									);
									_point.animPath.frames[_frame].points[2].MoveTo( 
										_load[layerId][item][point][frame][2].x,
										_load[layerId][item][point][frame][2].y
									);
								}
								
							}
							_point.animPath._PathBuild();
							
						}
						_item.animPath.ReFrames();
						
					}
					
				}
				
				ave.animation.GoToFrame(0);
				ave.controller.project.animation.CloseLoadBar();
			},
			
			OpenLoadBar: function() {
				ave.bars.blackout.show();
				ave.bars.animLoad.show();
			},
			CloseLoadBar: function() {
				ave.bars.animLoad.hide();
				ave.bars.blackout.hide();
			},
			
			OpenSaveBar: function() {
				var _save = {};
				
				var _layers = ave.layersList.items;
				for(var layerId in _layers) {
					_layers[layerId].items.forEach(function(item, itemInd) {
						if( item.animPath) {
							
							if(	_save[layerId] == undefined) _save[layerId] = {};
							_save[layerId][itemInd] = [];
							
							item.points.forEach(function(point, pointInd) {
								if(	!point.animPath) return;
								
								if(	_save[layerId][itemInd][pointInd] == undefined) _save[layerId][itemInd][pointInd] = {};
								
								var _frames = point.animPath.frames;
								for(var frame in _frames) {
									if( _save[layerId][itemInd][pointInd][frame] == undefined) _save[layerId][itemInd][pointInd][frame] = [];
									_frames[frame].points.forEach(function(animPoint, animPointInd) {
										if(animPoint.isActive) {
											_save[layerId][itemInd][pointInd][frame][animPointInd] = {x: animPoint.x, y: animPoint.y};
										} else {
											_save[layerId][itemInd][pointInd][frame][animPointInd] = {x: _frames[frame].points[0].x, y: _frames[frame].points[0].y};
										}
										
									});
									
								}
								
							});
						}
					});
					
				}
				
				ave.bars.animSave.children.textarea.value = JSON.stringify(_save);
				
				ave.bars.blackout.show();
				ave.bars.animSave.show();
			},
			
			CloseSaveBar: function() {
				ave.bars.blackout.hide();
				ave.bars.animSave.hide();
			}
		},
		
		web: {
			OpenSaveBar: function() {
				var _save = [];
				
				var _CheckGroup = function( items, saveElem) {
					items.forEach(function( item) {
						switch(item.type) {
						case 'Group':
							saveElem.push({
								type: 'Group',
								items: [],
								fill: item.style.fill,
								stroke: item.style.stroke,
								strokeWidth: item.style.strokeWidth 
							});
							_CheckGroup(item.items, saveElem[saveElem.length-1].items);
							break;
						case 'Layer':
							var _layerItems = [];
						
							item.items.forEach(function(layerItem) {
								var _saveItem = [];
								layerItem.points.forEach(function(point, pointInd) {
									if(	point.animPath
										&& Object.keys(point.animPath.frames).length
									) {
										var _frames = point.animPath.frames
										_saveItem[pointInd] = {};
										for(var frame in _frames) {
											_saveItem[pointInd][frame] = {
												x: _frames[frame].points[0].x,
												y: _frames[frame].points[0].y
											}
											
											if( _frames[frame].points[1].isActive) {
												_saveItem[pointInd][frame]['x1'] = _frames[frame].points[1].x,
												_saveItem[pointInd][frame]['y1'] = _frames[frame].points[1].y
											}
											
											if( _frames[frame].points[2].isActive) {
												_saveItem[pointInd][frame]['x2'] = _frames[frame].points[2].x,
												_saveItem[pointInd][frame]['y2'] = _frames[frame].points[2].y
											}
											
										}
										
									} else {
										if( point.isActive) {
											_saveItem[pointInd] = {
												0: {
													x: point.x,
													y: point.y
												}
											};
										}
										
									}
								});
								
								_layerItems.push(_saveItem);
							});
						
							var _saveLayer = {
								type: 'Layer',
								isClosed: item.isClosed,
								items: _layerItems
							};
							
							_saveLayer.fill = item.style.fill;
							_saveLayer.stroke = item.style.stroke;
							_saveLayer.strokeWidth = item.style.strokeWidth;
							
							saveElem.push(_saveLayer);
							break;
						}
					});
					
				};
				
				_CheckGroup( ave.hierarchy.items, _save);
				
				ave.bars.webSave.children.textarea.value = JSON.stringify({
					fps: ave.animation.fps,
					time: ave.animation.timeLength,
					viewBox: {
						width: ave.bars.scene.workSpace.viewBox.width,
						height: ave.bars.scene.workSpace.viewBox.height
					},
					hierarchy: _save
				});
				
				ave.bars.blackout.show();
				ave.bars.webSave.show();
			},
			
			CloseSaveBar: function() {
				ave.bars.blackout.hide();
				ave.bars.webSave.hide();
			}
		}
		
	},

	toolbar: {
		options: {
			graphic: {
				fill: function( val) {
					var _historyList = [];
					
					var _item;
					var _layers = ave.edit._layers;
					for(var i=0, len=_layers.length; i<len; i+=1) {
						_item = _layers[i];
						
						_historyList.push({
							item: _item,
							before: _item.style.fill
						});
						
						_item.style.fill = val;
					}
					
					var _groups = ave.edit._groups;
					for(var i=0, len=_groups.length; i<len; i+=1) {
						_item = _groups[i];
						
						_historyList.push({
							item: _item,
							before: _item.style.fill
						});
						
						_item.style.fill = val;
					}
					
					ave.history.AddEvent({
						type: 'fill',
						list: _historyList,
						after: val
					});
				},
				stroke: function( val) {
					var _historyList = [];
					
					var _layers = ave.edit._layers;
					var _item;
					for(var i=0, len=_layers.length; i<len; i+=1) {
						_item = _layers[i];
						
						_historyList.push({
							item: _item,
							before: _item.style.stroke
						});
						
						_item.style.stroke = val;
					}
					
					var _groups = ave.edit._groups;
					for(var i=0, len=_groups.length; i<len; i+=1) {
						_item = _groups[i];
						
						_historyList.push({
							item: _item,
							before: _item.style.stroke
						});
						
						_item.style.stroke = val;
					}
					
					ave.history.AddEvent({
						type: 'stroke',
						list: _historyList,
						after: val
					});
				},
				strokeWidth: function( val) {
					if( !val
						|| val == ''
						|| isNaN( Number(val) )
					) {
						ave.edit.graphic.strokeWidth._Rewrite();
						return;
					}
					
					var _historyList = [];
					
					ave.edit._layers.forEach( function( item) {
						_historyList.push({
							item: item,
							before: item.style.strokeWidth
						});
						
						item.style.strokeWidth = val;
					});
					
					ave.edit._groups.forEach( function( item) {
						_historyList.push({
							item: item,
							before: item.style.strokeWidth
						});
						
						item.style.strokeWidth = val;
					});
					
					ave.history.AddEvent({
						type: 'strokeWidth',
						list: _historyList,
						after: val
					});
					
					var _newList = {};
					_newList[val] = {};
					var _currList = ave.edit.graphic.strokeWidth._list;
					
					for(var key in _currList) {
						for(var itemKey in _currList[key]) {
							_newList[val][itemKey] = _currList[key][itemKey];
						}
					}
					ave.edit.graphic.strokeWidth._list = _newList;
					
				},
			}
		}
	},
	
	scene: {
		_param: {},
		
		tools: {
			_mode: undefined,
			get mode() {
				return this._mode;
			},
			set mode( newMode) {
				if( newMode == this._mode) { return; }
				
				switch( newMode) {
				case 'Hand':
				case 'Move':
				case 'Pen':
				case 'Edit':
				case 'Select':
				case 'Transform':
					ave.bars.toolbar.children[newMode].button.className += ' buttonActive';
					ave.bars.toolbar.children[newMode].options.style.display = 'block';
				case undefined:
					break;
				default:
					console.error('ave.controller.scene.tools.mode('+newMode+'): invalid mode.');
					return;
				}
				
				switch( newMode) {
				case 'Hand':
					ave.bars.scene.window.children.sceneLock.style['display'] = 'block';
					ave.bars.handArea.show();
					break;
				case 'Transform':
					this.transform.anchor.node.style.display = 'block';
					break;
				}
						
				
				if( this._mode) {
					var _isCurrMode = true;
					switch( this._mode) {
					case 'Hand':
						ave.bars.scene.window.children.sceneLock.style['display'] = '';
						ave.bars.handArea.hide();
						break;
					case 'Move':
						break;
					case 'Pen':
						this.pen.mode = 'Create';
						break;
					case 'Edit':
						this.edit.mode = 'Move';
						break;
					case 'Select':
						this.select.mode = 'Default';
						break;
					case 'Transform':
						// this.transform.mode = 'Default';
						this.transform.anchor.node.style.display = 'none';
						break;
					default:
						_isCurrMode = false;
						break;
					}
					
					if( _isCurrMode) {
						grnch.RemoveClass( ave.bars.toolbar.children[this._mode].button, 'buttonActive');
						ave.bars.toolbar.children[this._mode].options.style.display = '';
					}
				}
					
				this._mode = newMode;
			},
			
			hand: {
				mode: 'Hand',
				
				HandEvent: function() {
					var _OnMouseMove = function(event) {
						ave.bars.scene.workSpace.position.x += event.movementX;
						ave.bars.scene.workSpace.position.y += event.movementY;
						ave.bars.scene.workSpace.Move();
					};
					var _OnMouseUp = function() {
						document.removeEventListener("mousemove", _OnMouseMove);
						document.removeEventListener("mouseup", _OnMouseUp);
					};
					
					document.addEventListener("mousemove", _OnMouseMove);
					document.addEventListener("mouseup", _OnMouseUp);
				}
			},
			
			move: {
				_mode: 'Move',
				get mode() {
					return this._mode;
				},
				set mode( newMode) {
					if( newMode == this._mode) { return; }
					
					switch(newMode) {
					case 'Move':
						break;
					case 'Select':
						break;
					default:
						return;
					}
					
					
					ave.bars.toolbar.children.Move.modes[newMode].className += ' activeButton';
					
					switch(this._mode) {
					case 'Move':
						break;
					case 'Select':
						break;
					}
					
					if( ave.bars.toolbar.children.Move.modes[this._mode] != undefined) {
						grnch.RemoveClass(
							ave.bars.toolbar.children.Move.modes[this._mode],
							'activeButton'
						);
					}
					
					this._mode = newMode;
				},
				
				mouseMoveEvent: {
					SceneElementsMove: function(event) {
						var _param = ave.controller.scene._param;
						var _zoom = ave.bars.scene.workSpace.zoom;
						
						var _x = event.screenX /_zoom;
						var _y = event.screenY /_zoom;
						
						var _move = {
							x: (event.screenX - _param.startScreen.x) /_zoom,
							y: (event.screenY - _param.startScreen.y) /_zoom
						};
						
						var _NodeMove = function( x, y, _layer) {
							_layer.nodes.scene.content.setAttributeNS(null, 'transform', 'translate('+x+', '+y+')');
							_layer.nodes.scene.labelGroup.setAttributeNS(null, 'transform', 'translate('+x+', '+y+')');
							_layer.nodes.scene.layerPath.setAttributeNS(null, 'transform', 'translate('+x+', '+y+')');
						};
						
						// Layers
						var _isShiftX = Math.abs(_move.x) > Math.abs(_move.y);
						ave.edit._layers.forEach( function( _layer) {
							if( event.shiftKey) {
								if( _isShiftX) {
									_NodeMove( _move.x, 0, _layer);
								} else {
									_NodeMove( 0, _move.y, _layer);
								}
							} else {
								_NodeMove( _move.x, _move.y, _layer);
							}
								
						});
						
						// Stack Points
						for(var key in _param.stackList) {
							_param.stackList[key].forEach( function( _elem) {
								if( event.shiftKey) {
									if( _isShiftX) {
										_elem.item.points[0].MoveTo( _elem.before.x+ _move.x, _elem.before.y);
									} else {
										_elem.item.points[0].MoveTo( _elem.before.x, _elem.before.y+ _move.y);
									}
								} else {
									_elem.item.points[0].MoveTo( _elem.before.x+_move.x, _elem.before.y+_move.y);
								}
							});
							ave.layersList.items[key]._PathBuild();
						}
						
					}
				},
				
				mouseUpEvent: {
					SceneElementsMove: function(event) {
						var _param = ave.controller.scene._param;
						var _zoom = ave.bars.scene.workSpace.zoom;
						var _moveTool = ave.controller.scene.tools.move;
						
						document.removeEventListener("mousemove", _moveTool.mouseMoveEvent.SceneElementsMove);
						document.removeEventListener("mouseup", _moveTool.mouseUpEvent.SceneElementsMove);
						
						var _move = {
							x: (event.screenX - _param.startScreen.x) /_zoom,
							y: (event.screenY - _param.startScreen.y) /_zoom
						};
						
						var _isShiftX = Math.abs(_move.x) > Math.abs(_move.y);
						
						ave.edit._layers.forEach( function(_layer) {
							_layer.nodes.scene.content.setAttributeNS(null, 'transform', '');
							_layer.nodes.scene.labelGroup.setAttributeNS(null, 'transform', '');
							_layer.nodes.scene.layerPath.setAttributeNS(null, 'transform', '');
							
							_layer.items.forEach( function(item) {
								if( event.shiftKey) {
									if( _isShiftX) {
										item.points[0].Move( _move.x, 0);
									} else {
										item.points[0].Move( 0, _move.y);
									}
								} else {
									item.points[0].Move( _move.x, _move.y);
								}
							});
							_layer._PathBuild();
						});
						
						_move.x = 0;
						_move.y = 0;
						
						var _items = _param.history.itemsList;
						for(var key in _items) {
							_items[key].forEach(function(elem) {
								elem.after = {
									x: elem.item.points[0].x,
									y: elem.item.points[0].y
								};
							});
						}
						
						ave.history.AddEvent({
							type: 'layerItemsMove',
							itemsList: _param.history.itemsList
						});
						
					}
				}
				
			},
			
			pen: {
				_mode: 'Create',
				get mode() {
					return this._mode;
				},
				set mode( newMode) {
					switch( newMode) {
					case 'Create':
					
						break;
					case 'AddOrDel':
						ave.bars.scene.workSpace.children.svgItemsPath.style.display = 'block';
						ave.bars.scene.window.children.svgArea.className += ' svgRemoveMode';
						break;
					default:
						console.error('ave.controller.scene.tools.pen.mode('+newMode+'): invelid mode.');
						return;
					}
					
					ave.bars.toolbar.children.Pen.modes[newMode].className += ' activeButton';
					
					switch( this._mode) {
					case 'Create':
					
						break;
					case 'AddOrDel':
						ave.bars.scene.workSpace.children.svgItemsPath.style.display = 'none';
						grnch.RemoveClass( ave.bars.scene.window.children.svgArea, 'svgRemoveMode');
						break;
					}
					
					if( ave.bars.toolbar.children.Pen.modes[this._mode] != undefined) {
						grnch.RemoveClass(
							ave.bars.toolbar.children.Pen.modes[this._mode],
							'activeButton'
						);
					}
					
					this._mode = newMode;
				},
			},
			
			edit: {
				_mode: 'Move',
				get mode() {
					return this._mode;
				},
				set mode( newMode) {
					if( newMode == this._mode) { return; }
					
					switch(newMode) {
					case 'Move':
						break;
					case 'Select':
						break;
					case 'Curves':
						break;
					default:
						return;
					}
					
					
					ave.bars.toolbar.children.Edit.modes[newMode].className += ' activeButton';
					
					switch(this._mode) {
					case 'Move':
						break;
					case 'Select':
						break;
					case 'Curves':
						break;
					}
					
					if( ave.bars.toolbar.children.Edit.modes[this._mode] != undefined) {
						grnch.RemoveClass(
							ave.bars.toolbar.children.Edit.modes[this._mode],
							'activeButton'
						);
					}
					
					this._mode = newMode;
				},
				
				mouseMoveEvent: {
					FrameItemMove: function(event) {
						var _param = ave.controller.scene._param;
						var _zoom = ave.bars.scene.workSpace.zoom;
						
						var _vec = {
							x: (event.screenX - _param.startScreen.x) /_zoom,
							y: (event.screenY - _param.startScreen.y) /_zoom
						}
						
						var _isShiftX = Math.abs(_vec.x) > Math.abs(_vec.y);
						
						if( event.shiftKey) {
							if( _isShiftX) {
								_param.frame.points[0].MoveTo( _param.history.before.x+_vec.x, _param.history.before.y);
							} else {
								_param.frame.points[0].MoveTo( _param.history.before.x, _param.history.before.y+_vec.y);
							}
						} else {
							_param.frame.points[0].MoveTo( _param.history.before.x+_vec.x, _param.history.before.y+_vec.y);
						}
						
						_param.layerItem.points[_param.pointInd].animPath._PathBuild();
						_param.layerItem.animPath.ReFrames();
						
						ave.animation.ClickTimeline();
						
					},
					
					LayerItemsMove: function(event) {
						var _param = ave.controller.scene._param;
						var _zoom = ave.bars.scene.workSpace.zoom;
						
						var _vec = {
							x: (event.screenX - _param.startScreen.x) /_zoom,
							y: (event.screenY - _param.startScreen.y) /_zoom
						}
						
						var _isShiftX = Math.abs(_vec.x) > Math.abs(_vec.y);
						
						for(var key in _param.history.itemsList) {
							_param.history.itemsList[key].forEach(function( _elem) {
								if( event.shiftKey) {
									if( _isShiftX) {
										_elem.item.points[0].MoveTo( _elem.before.x+_vec.x, _elem.before.y);
									} else {
										_elem.item.points[0].MoveTo( _elem.before.x, _elem.before.y+_vec.y);
									}
								} else {
									_elem.item.points[0].MoveTo( _elem.before.x+_vec.x, _elem.before.y+_vec.y);
								}
								
							});
							
							ave.layersList.items[key]._PathBuild();
						}
					},
					
					RewriteAllFrameCurves: function(event) {
						var _param = ave.controller.scene._param;
						var _zoom = ave.bars.scene.workSpace.zoom;
			
						var _vec = { 
							x: (event.screenX - _param.startScreen.x) /_zoom,
							y: (event.screenY - _param.startScreen.y) /_zoom
						};
						
						var _screenVec = {
							x: event.screenX -  _param.startScreen.x,
							y: event.screenY -  _param.startScreen.y
						};
						var _screenVecLength = Math.abs( Math.sqrt(_screenVec.x * _screenVec.x + _screenVec.y * _screenVec.y) );
						
						if( !_param.isMove) {
							if( _screenVecLength > 5) {
								_param.isMove = true;
							} else {
								return;
							}
						}
						
						var _points = _param.frame.points;
						if( _screenVecLength > 5) {
							var _sup = [];
							var _isShiftX;
							
							var _SupMove = function(ind) {
								_points[ind].isActive = true;
								
								if( event.shiftKey) {
									if( _isShiftX ) {
										_points[ind].MoveTo( _sup[ind].x, _points[0].y);
									} else {
										_points[ind].MoveTo( _points[0].x, _sup[ind].y);
									}
								} else {
									_points[ind].MoveTo( _sup[ind].x, _sup[ind].y);
								}
							};
							
							_sup[2] = { 
								x: _param.startPos.x + _vec.x,
								y: _param.startPos.y + _vec.y
							}
							
							if( event.shiftKey) {
								_isShiftX = Math.abs(_sup[2].x - _points[0].x) > Math.abs(_sup[2].y - _points[0].y);
							}
							
							_SupMove(2);
							
							if( !_param.switchToOneCurve) {
								_sup[1] = { 
									x: _points[0].x + (_points[0].x - _sup[2].x),
									y: _points[0].y + (_points[0].y - _sup[2].y)
								}
								_SupMove(1);
							}
						
						} else {
							_points[2].isActive = false;
							
							if( !_param.switchToOneCurve) {
								_points[1].isActive = false;
							}
						}
						
						
						_param.layerItem.points[_param.pointInd].animPath._PathBuild();
						_param.layerItem.animPath.ReFrames();
					
						ave.animation.ClickTimeline();
					},
					
					RewriteAllCurves: function(event) {
						var _param = ave.controller.scene._param;
						var _zoom = ave.bars.scene.workSpace.zoom;
			
						var _vec = { 
							x: (event.screenX - _param.startScreen.x) /_zoom,
							y: (event.screenY - _param.startScreen.y) /_zoom
						};
						
						var _screenVec = {
							x: event.screenX -  _param.startScreen.x,
							y: event.screenY -  _param.startScreen.y
						};
						var _screenVecLength = Math.abs( Math.sqrt(_screenVec.x * _screenVec.x + _screenVec.y * _screenVec.y) );
						
						if( !_param.isMove) {
							if( _screenVecLength > 5) {
								_param.isMove = true;
							} else {
								return;
							}
						}
					
						var _editList = ave.edit._items;
						for(var key in _editList) {
							_editList[key].forEach(function( _item) {
							// var _item = _param.layerItem;
								var _points = _item.points;
								if( _screenVecLength > 5) {
									var _sup = [];
									var _isShiftX;
									
									var _SupMove = function(ind) {
										_points[ind].isActive = true;
										
										if( event.shiftKey) {
											if( _isShiftX ) {
												_points[ind].MoveTo( _sup[ind].x, _points[0].y);
											} else {
												_points[ind].MoveTo( _points[0].x, _sup[ind].y);
											}
										} else {
											_points[ind].MoveTo( _sup[ind].x, _sup[ind].y);
										}
									};
									
									_sup[2] = { 
										x: _param.startPos.x + _vec.x,
										y: _param.startPos.y + _vec.y
									}
									
									if( event.shiftKey) {
										_isShiftX = Math.abs(_sup[2].x - _points[0].x) > Math.abs(_sup[2].y - _points[0].y);
									}
									
									_SupMove(2);
									
									if( !_param.switchToOneCurve) {
										_sup[1] = { 
											x: _points[0].x + (_points[0].x - _sup[2].x),
											y: _points[0].y + (_points[0].y - _sup[2].y)
										}
										_SupMove(1);
									}
								
									ave.layersList.items[key]._PathBuild();
									// _param.layer._PathBuild();
								} else {
									_points[2].isActive = false;
									
									if( !_param.switchToOneCurve) {
										_points[1].isActive = false;
									}
								}
							});
						}
							
					},
					
					RewriteOneFrameCurve: function(event) {
						var _param = ave.controller.scene._param;
						var _zoom = ave.bars.scene.workSpace.zoom;
						
						var _vec = {
							x: event.screenX - _param.startScreen.x,
							y: event.screenY - _param.startScreen.y
						}
						
						var newX = _param.startPos.x + _vec.x / _zoom;
						var newY = _param.startPos.y + _vec.y / _zoom;
						
						var _screenVec = {
							x: newX - _param.frame.points[0].x,
							y: newY - _param.frame.points[0].y
						}
						var _screenVecLength = Math.abs( Math.sqrt(_screenVec.x * _screenVec.x + _screenVec.y * _screenVec.y) );
						
						if( _screenVecLength > 5) {
							_param.frame.points[_param.animPointInd].isActive = true;
							
							var _mainPoint = _param.frame.points[0];
							if( event.shiftKey) {
								if( Math.abs(newX - _mainPoint.x) > Math.abs(newY - _mainPoint.y)) {
									_param.frame.points[ _param.animPointInd ].MoveTo( newX, _mainPoint.y);
								} else {
									_param.frame.points[ _param.animPointInd ].MoveTo( _mainPoint.x, newY);
								}
							} else {
								_param.frame.points[ _param.animPointInd ].MoveTo( newX, newY);
							}
							
						} else {
							_param.frame.points[ _param.animPointInd ].isActive = false;
						}
						
						_param.layerItem.points[_param.pointInd].animPath._PathBuild();
						_param.layerItem.animPath.ReFrames();
					
						ave.animation.ClickTimeline();
					},
					
					RewriteOneCurve: function(event) {
						var _param = ave.controller.scene._param;
						var _zoom = ave.bars.scene.workSpace.zoom;
						
						var _vec = {
							x: event.screenX - _param.startScreen.x,
							y: event.screenY - _param.startScreen.y
						}
						
						var newX = _param.startPos.x + _vec.x / _zoom;
						var newY = _param.startPos.y + _vec.y / _zoom;
						
						var _screenVec = {
							x: newX - _param.layerItem.points[0].x,
							y: newY - _param.layerItem.points[0].y
						}
						var _screenVecLength = Math.abs( Math.sqrt(_screenVec.x * _screenVec.x + _screenVec.y * _screenVec.y) );
						
						if( _screenVecLength > 5) {
							_param.layerItem.points[_param.pointInd].isActive = true;
							
							var _mainPoint = _param.layerItem.points[0];
							if( event.shiftKey) {
								if( Math.abs(newX - _mainPoint.x) > Math.abs(newY - _mainPoint.y)) {
									_param.layerItem.points[ _param.pointInd ].MoveTo( newX, _mainPoint.y);
								} else {
									_param.layerItem.points[ _param.pointInd ].MoveTo( _mainPoint.x, newY);
								}
							} else {
								_param.layerItem.points[ _param.pointInd ].MoveTo( newX, newY);
							}
							
						} else {
							_param.layerItem.points[ _param.pointInd ].isActive = false;
						}
						
						_param.layer._PathBuild();	
						
					}
				}
				
			},
			
			select: {
				_mode: 'Default',
				get mode() {
					return this._mode;
				},
				set mode( newMode) {
					if( newMode == this._mode) { return; }
					
					switch(newMode) {
					case 'Default':
						break;
					case 'Add':
						break;
					case 'Remove':
						break;
					default:
						return;
					}
					
					
					ave.bars.toolbar.children.Select.modes[newMode].className += ' activeButton';
					
					switch(this._mode) {
					case 'Default':
						break;
					case 'Add':
						break;
					case 'Remove':
						break;
					}
					
					if( ave.bars.toolbar.children.Select.modes[this._mode] != undefined) {
						grnch.RemoveClass(
							ave.bars.toolbar.children.Select.modes[this._mode],
							'activeButton'
						);
					}
					
					this._mode = newMode;
				},
				
			},
	
			transform: {
				_mode: 'Default',
				get mode() {
					return this._mode;
				},
				set mode( newMode) {
					if( newMode == this._mode) { return; }
					
					switch(newMode) {
					case 'Default':
						break;
					default:
						return;
					}
					
					
					ave.bars.toolbar.children.Select.modes[newMode].className += ' activeButton';
					
					switch(this._mode) {
					case 'Default':
						break;
					}
					
					if( ave.bars.toolbar.children.Select.modes[this._mode] != undefined) {
						grnch.RemoveClass(
							ave.bars.toolbar.children.Select.modes[this._mode],
							'activeButton'
						);
					}
					
					this._mode = newMode;
				},
				
				anchor: {
					node: undefined,
					
					_x: 0,
					get x() {
						return this._x;
					},
					set x(val) {
						this.node.setAttributeNS(null, 'x', val);
						this._x = val;
					},
					
					_y: 0,
					get y() {
						return this._y;
					},
					set y(val) {
						this.node.setAttributeNS(null, 'y', val);
						this._y = val;
					}
					
				},
				
			},
			
		},
		
		OnMouseDown: function(event) {
			if(	event.button != 0) { return; }
			
			var _scene = ave.controller.scene;
			
			_scene._param = {
				startScreen: {
					x: event.screenX,
					y: event.screenY
				},
				startPos: {},
				history: {},
				isMove: false,
				switchToOneCurve: false
			};
			var _param = _scene._param;
			
			var _zoom = ave.bars.scene.workSpace.zoom;
			
			_param.target = event.target;
			
			var _targetId =	_param.target.getAttributeNS(ave._xlinkns, 'id') || _param.target.getAttributeNS(ave._xmlns, 'id') || _param.target.id;
			
			var _OnMouseMove, _OnMouseUp;
			
			var _isAnim = false;
			
			_param.startPos.x = event.layerX/_zoom;
			_param.startPos.y = event.layerY/_zoom;
			
			switch( _targetId.split('+')[0] ) {
			case 'ave-sceneContent':
				var _layerId = _targetId.split('+')[1];
				_param.layer = ave.layersList.items[_layerId];
				break;
			case 'ave-sceneItemPath':
				var _layerItemId = _param.target.id.split('+')[1];
				_param.layerItem = ave.layerItemsList.items[_layerItemId];
				break;
			case 'ave-labelPoint':
				_param.startPos.x = Number( _param.target.getAttributeNS(null, 'x') );
				_param.startPos.y = Number( _param.target.getAttributeNS(null, 'y') );
				
				_param.pointInd = 0;
				
				var _layerItemId = _param.target.parentNode.id.split('+')[1];
				_param.layerItem = ave.layerItemsList.items[_layerItemId];				
				break;
			case 'ave-protoLabelPoint':
				var _layerItemId = _targetId.split('+')[1];
				_param.layerItem = ave.layerItemsList.items[_layerItemId];
				
				_param.pointInd = 0;
				
				_param.startPos.x = Number( _param.layerItem.points[0].x );
				_param.startPos.y = Number( _param.layerItem.points[0].y );
				
				break;
			case 'ave-labelSupPoint':
				_param.startPos.x =  Number( _param.target.getAttributeNS(null, 'x') );
				_param.startPos.y =  Number( _param.target.getAttributeNS(null, 'y') );
				
				_param.pointInd = Number( _targetId.split('+')[1] );
				
				var _layerItemId = _param.target.parentNode.parentNode.parentNode.id.split('+')[1];
				_param.layerItem = ave.layerItemsList.items[_layerItemId];
				break;
			case 'ave-animPoint':
				_isAnim = true;
				
				_param.animPointInd = 0;
				
				var _pointInd = _param.target.parentNode.parentNode.id.split('+')[2];
				_param.pointInd = Number(_pointInd);
				
				var _layerItemId = _param.target.parentNode.parentNode.id.split('+')[1];
				_param.layerItem = ave.layerItemsList.items[_layerItemId];
				
				var _frameNum = Number( _param.target.parentNode.id.split('+')[1] );
				_param.frameNum = Number(_frameNum);
				_param.frame = _param.layerItem.points[_pointInd].animPath.frames[_frameNum];
				break;
			case 'ave-animSupPoint':
				_isAnim = true;
				
				_param.animPointInd = Number(_targetId.split('+')[1]);
				
				var _animLabelId = _param.target.parentNode.parentNode.parentNode.parentNode.id.split('+');
				
				var _pointInd = _animLabelId[2];
				_param.pointInd = Number(_pointInd);
				
				var _layerItemId = _animLabelId[1];
				_param.layerItem = ave.layerItemsList.items[_layerItemId];
				
				var _frameNum = Number( _param.target.parentNode.parentNode.parentNode.id.split('+')[1] );
				_param.frameNum = Number(_frameNum);
				_param.frame = _param.layerItem.points[_pointInd].animPath.frames[_frameNum];
				break;
			default:
				break;
			}
			
			if( _param.layerItem) {
				_param.layer = _param.layerItem._parent;
			}
			
			switch( _scene.tools.mode ) {
			case 'Hand':
				return;
			case 'Move':
				switch( _scene.tools.move.mode) {
				case 'Move': 
					if( _isAnim) {
						
						
					} else {
						// if autoSecect
						if( _param.layer
							&& ave.edit._layers.length == 0
						) {
							ave.edit.AddLayer( _param.layer);
						}
						
						var _historyList = {};
						_param.stackList = {};
							
						ave.edit._layers.forEach(function(layer) {
							var _key = layer.id;
							_historyList[ _key ] = [];
							
							layer.items.forEach(function(item) {
								_historyList[ _key ].push({
									item: item,
									before: {
										x: item.points[0].x,
										y: item.points[0].y
									}
								});
								
							});
							
						});
						
						var _stack = ave.edit._itemsStack;
						for(var key in _stack) {
							_historyList[key] = [];
							_param.stackList[key] = [];
							
							_stack[key].forEach(function(item) {
								var _obj = {
									item: item,
									before: {
										x: item.points[0].x,
										y: item.points[0].y
									}
								};
								
								_historyList[key].push(_obj);
								_param.stackList[key].push(_obj);
							});
							
						}
						
						_param.history = {
							itemsList: _historyList
						};
						
						_OnMouseMove = _scene.tools.move.mouseMoveEvent.SceneElementsMove;
						_OnMouseUp = _scene.tools.move.mouseUpEvent.SceneElementsMove;
					}
					
					break;
				case 'Select':
					if( _param.layer) {
						if(	ave.edit._layers.indexOf(_param.layer) != -1
						){
							ave.edit.RemoveLayer(_param.layer);
						} else {
							ave.edit.AddLayer(_param.layer);
						}
					}
					break;
				}
				break;
			case 'Pen':
				switch( _scene.tools.pen.mode) {
				case 'Create':
					var _historyItemsList = [];
				
					ave.edit._layers.forEach(function( _layer) {
						if( _param.layerItem
							&& _layer.items.length > 0
							// && ave.edit._items[_layer.id].indexOf( _layer.items[ _layer.items.length-1 ] ) > -1
							&& _layer.items[0].points[0].x == _param.startPos.x
							&& _layer.items[0].points[0].y == _param.startPos.y
						) {
							_layer.isClosed = true;
							ave.edit.RemoveItemsInLayer( _layer);
							ave.edit.AddItem( _layer.items[0] );
							
							_historyItemsList.push({
								type: 'closeLayer',
								layer: _layer
							});
						} else {
							var _item = new ave.prefabs.LayerItem( _param.startPos);
							
							_layer.AppendItem( _item);
							ave.edit.RemoveItemsInLayer( _layer);
							ave.edit.AddItem( _item);
							
							_historyItemsList.push({
								item: _item,
								layer: _layer
							});
						}
						
						_layer._PathBuild();
						
					});
					
					ave.history.AddEvent({
						type: 'createLayerItem',
						itemsList: _historyItemsList
					});
					
					_OnMouseMove = _scene.tools.edit.mouseMoveEvent.RewriteAllCurves;
					break;
				case 'AddOrDel':
					if( !_param.layerItem) return;
					
					if( _isAnim) {
						if( _param.animPointInd > 0) return;
						
						var _point = _param.layerItem.points[_param.pointInd];
						
						ave.history.AddEvent({
							type: 'removeFrame',
							frame: _param.frame
						});
						
						switch(_point._index) {
						case 0:
							_param.layerItem.animPath.nodes.svgLine.main.removeChild(_param.frame.nodes.timelinePoint);
							break;
						case 1:
							_param.layerItem.animPath.nodes.svgLine.sup1.removeChild(_param.frame.nodes.timelinePoint);
							break;
						case 2:
							_param.layerItem.animPath.nodes.svgLine.sup2.removeChild(_param.frame.nodes.timelinePoint);
							break;
						}
						
						_point.animPath.RemoveFrame(_param.frameNum);
						ave.animation.ClickTimeline();
						
						return;
					}
					
					if( _param.pointInd === 0) { 	// Del
						ave.edit.RemoveItem(_param.layerItem);
						
						ave.history.AddEvent({
							type: 'layerItemRemove',
							layer: _param.layer,
							item: _param.layerItem,
							index: _param.layerItem._index
						});
						
						_param.layer.RemoveItem(_param.layerItem);
						_param.layer._PathBuild();
						return;
					} else {						// Add
						if( _param.pointInd > 0) return;
						var _itemInd = _param.layerItem._index;
						var _item = new ave.prefabs.LayerItem( _param.startPos);
						
						if( _itemInd == 0) {
							_param.layer.AppendItem(_item);
						} else {
							_param.layer.InsertItemBefore( _itemInd, _item);
						}
						
						ave.edit.SelectOneItem( _item);
						_param.layer._PathBuild();
						
						
						ave.history.AddEvent({
							type: 'layerInsertItemBefore',
							layer: _param.layer,
							item: _item,
							index: _itemInd
						});
						
						_OnMouseMove = _scene.tools.edit.mouseMoveEvent.RewriteAllCurves;
					}
					
					break;
				}
				break;
			case 'Edit':
				switch( _scene.tools.edit.mode) {
				case 'Move':
					if( _isAnim) {
						_param.history.type = 'framePointMove';
						_param.history.frame = _param.frame;
						_param.history.before = {
							x: _param.frame.points[0].x,
							y: _param.frame.points[0].y
						};
						
						_OnMouseMove = _scene.tools.edit.mouseMoveEvent.FrameItemMove;
						
						_OnMouseUp = function() {
							document.removeEventListener("mousemove", _OnMouseMove);
							document.removeEventListener("mouseup", _OnMouseUp);
							
							_param.history.after = {
								x: _param.frame.points[0].x,
								y: _param.frame.points[0].y
							};
							
							ave.history.AddEvent(_param.history);
						};
						
					} else {
						if( _param.layerItem) {
							ave.edit.SelectOneItem( _param.layerItem);
						}
						
						var _historyList = {};
						var _items = ave.edit._items;
						if( Object.keys(_items).length == 0) return;
						
						for(var key in _items) {
							_historyList[key] = [];
							
							_items[key].forEach(function( _item) {
								_historyList[key].push({
									item: _item,
									before: {
										x: _item.points[0].x,
										y: _item.points[0].y
									}
								});
							});
						}
						
						_param.history.itemsList = _historyList;
						
						
						_OnMouseMove = _scene.tools.edit.mouseMoveEvent.LayerItemsMove;
						
						_OnMouseUp = function() {
							document.removeEventListener("mousemove", _OnMouseMove);
							document.removeEventListener("mouseup", _OnMouseUp);
							
							for(var key in _param.history.itemsList) {
								_param.history.itemsList[key].forEach(function(elem) {
									elem.after = {
										x: elem.item.points[0].x,
										y: elem.item.points[0].y
									}
								});
							}
							
							ave.history.AddEvent({
								type: 'layerItemsMove',
								itemsList: _param.history.itemsList
							});
						};
					}
					break;
				case 'Select':
					if( _param.layerItem) {
						if(	ave.edit._items[_param.layerItem._parent.id]
							&& ave.edit._items[_param.layerItem._parent.id].indexOf(_param.layerItem) != -1
						){
							ave.edit.RemoveItem(_param.layerItem);
						} else {
							ave.edit.AddItem(_param.layerItem);
						}
					}
					return;
				case 'Curves':
					if( _param.pointInd === undefined) return;
					
					if( _isAnim) {
						_param.history.type = 'framePointCurves';
						_param.history.frame = _param.frame;
						
						if( _param.animPointInd === 0 ) {
							_OnMouseMove = _scene.tools.edit.mouseMoveEvent.RewriteAllFrameCurves;
						} else {
							_OnMouseMove = _scene.tools.edit.mouseMoveEvent.RewriteOneFrameCurve;
						}
						
						var _before = {};
								
						if(	_param.frame.points[1].isActive) {
							_before.x1 = _param.frame.points[1].x;
							_before.y1 = _param.frame.points[1].y;
						}
						if(	_param.frame.points[2].isActive) {
							_before.x2 = _param.frame.points[2].x;
							_before.y2 = _param.frame.points[2].y;
						}
						
						_param.history.before = _before;
						
						_OnMouseUp = function() {
							document.removeEventListener("mousemove", _OnMouseMove);
							document.removeEventListener("mouseup", _OnMouseUp);
							
							var _after = {};
							
							if(	_param.frame.points[1].isActive) {
								_after.x1 = _param.frame.points[1].x;
								_after.y1 = _param.frame.points[1].y;
							}
							if(	_param.frame.points[2].isActive) {
								_after.x2 = _param.frame.points[2].x;
								_after.y2 = _param.frame.points[2].y;
							}
							
							_param.history.after = _after;
							
							ave.history.AddEvent(_param.history);
							
						};
						
					} else {
						if( _param.pointInd === 0 ) {
							ave.edit.SelectOneItem( _param.layerItem); // mb remove
							_OnMouseMove = _scene.tools.edit.mouseMoveEvent.RewriteAllCurves;
						} else {
							_OnMouseMove = _scene.tools.edit.mouseMoveEvent.RewriteOneCurve;
						}
						
						_param.history.itemsList = [];
						
						var _editList = ave.edit._items;
						for(var key in _editList) {
							_editList[key].forEach(function( _item) {
								var _before = {};
								
								if(	_item.points[1].isActive) {
									_before.x1 = _item.points[1].x;
									_before.y1 = _item.points[1].y;
								}
								if(	_item.points[2].isActive) {
									_before.x2 = _item.points[2].x;
									_before.y2 = _item.points[2].y;
								}
								
								_param.history.itemsList.push({
									item: _item,
									before: _before
								});
								
							});
						}
						
						_OnMouseUp = function() {
							document.removeEventListener("mousemove", _OnMouseMove);
							document.removeEventListener("mouseup", _OnMouseUp);
							
							_param.history.itemsList.forEach(function(elem) {
								var _after = {};
								
								if(	elem.item.points[1].isActive) {
									_after.x1 = elem.item.points[1].x;
									_after.y1 = elem.item.points[1].y;
								}
								if(	elem.item.points[2].isActive) {
									_after.x2 = elem.item.points[2].x;
									_after.y2 = elem.item.points[2].y;
								}
								
								elem.after = _after;
							});
							
							ave.history.AddEvent({
								type: 'layerItemsCurve',
								itemsList: _param.history.itemsList
							});
						};
						
					}
					break;
				}
				break;
			case 'Select':
				var _Callback;
				var _area;
				var _svgElem = ave.bars.scene.workSpace.children.svgSelectArea;
				
				switch( _scene.tools.select.mode) {
				case 'Default':
					_Callback = function( layerItem) {
						var _point = layerItem.points[0];
						
						if(	_point.x >= _area.start.x
							&& _point.y >= _area.start.y
							&& _point.x <= _area.end.x
							&& _point.y <= _area.end.y
						) {
							ave.edit.AddItem(layerItem);
						} else {
							ave.edit.RemoveItem(layerItem);
						}
					};
					
					break;
				case 'Add':
					_Callback = function( layerItem) {
						var _point = layerItem.points[0];
						
						if(	_point.x >= _area.start.x
							&& _point.y >= _area.start.y
							&& _point.x <= _area.end.x
							&& _point.y <= _area.end.y
						) {
							ave.edit.AddItem(layerItem);
						}
					};
					
					break;
				case 'Remove':
					_Callback = function( layerItem) {
						var _point = layerItem.points[0];
						
						if(	_point.x >= _area.start.x
							&& _point.y >= _area.start.y
							&& _point.x <= _area.end.x
							&& _point.y <= _area.end.y
						) {
							ave.edit.RemoveItem(layerItem);
						}
					};
					
					break;
				}
				
				_svgElem.setAttributeNS(null, 'd', '');
				_svgElem.style.display = 'block';
				
				_OnMouseMove = function(event) {	
					var _endPos = {
						x: event.layerX/_zoom,
						y: event.layerY/_zoom
					};
					
					_svgElem.setAttributeNS(null, 'd', 'M '+_param.startPos.x+' '+_param.startPos.y+' L '+_endPos.x+' '+_param.startPos.y+' L '+_endPos.x+' '+_endPos.y+' L'+_param.startPos.x+' '+_endPos.y+' Z');
				};
				
				_OnMouseUp = function(event) {
					var _endPos = {
						x: event.layerX/_zoom,
						y: event.layerY/_zoom
					};
					
					_area = {
						start: {},
						end: {}
					};
					
					if(	_param.startPos.x < _endPos.x) {
						_area.start.x = _param.startPos.x;
						_area.end.x = _endPos.x;
					} else {
						_area.start.x = _endPos.x;
						_area.end.x = _param.startPos.x;
					}
					
					if(	_param.startPos.y < _endPos.y) {
						_area.start.y = _param.startPos.y;
						_area.end.y = _endPos.y;
					} else {
						_area.start.y = _endPos.y;
						_area.end.y = _param.startPos.y;
					}
					
					ave.edit._layers.forEach(function(layer) {
						layer.items.forEach(function(layerItem) {
							_Callback(layerItem);
						});
						
					});
					
					_svgElem.style.display = '';
					
					document.removeEventListener("mousemove", _OnMouseMove);
					document.removeEventListener("mouseup", _OnMouseUp);
					
				};
			
				break;
			case 'Transform':
				var _anchor = ave.controller.scene.tools.transform.anchor;
			
				switch(_targetId.split('+')[0]) {
				case 'ave-svgAnchor':
					_OnMouseMove = function(event) {	
						var _endPos = {
							x: event.layerX/_zoom,
							y: event.layerY/_zoom
						};
						
						_anchor.x = _endPos.x;
						_anchor.y = _endPos.y;
					};
					
					break;
				default:
					var _itemList = {};
					_param._history = {
						type: 'transformRotate',
						itemsList: {}
					};
					
					var _startVec = { x: _param.startPos.x-_anchor.x, y: _param.startPos.y-_anchor.y};
					var _startLength = Math.sqrt( Math.pow(_startVec.x,2) + Math.pow(_startVec.y,2) );
					var _sCosA = _startVec.x /_startLength;
					
					var _angle = Math.acos(_sCosA)*(180/Math.PI);
					if( _startVec.y > 0) _angle = _angle * -1;
					// console.log(_angle);
					
					var _sCosA = Math.cos(_angle*Math.PI/180);
					var _sSinA = Math.sin(_angle*Math.PI/180);
					
					for(var layerKey in ave.edit._items) {
						_itemList[layerKey] = [];
						_param._history.itemsList[layerKey] = [];
						
						ave.edit._items[layerKey].forEach(function(layerItem) {
							var _elem = [];
							
							layerItem.points.forEach(function(point) {
								if( point.isActive) {
									_param._history.itemsList[layerKey].push({
										point: point,
										before: {
											x: point.x,
											y: point.y
										}
									});
									
									var _pos = {
										x: point.x - _anchor.x,
										y: point.y - _anchor.y
									};
									
									_elem.push({
										point: point,
										x: _pos.x *_sCosA - _pos.y *_sSinA,
										y: _pos.x *_sSinA + _pos.y *_sCosA
									});
								}
								
							});
							
							_itemList[layerKey].push(_elem);
						});
					}
					
					for(var layerKey in ave.edit._itemsStack) {
						_itemList[layerKey] = [];
						_param._history.itemsList[layerKey] = [];
						
						ave.edit._itemsStack[layerKey].forEach(function(layerItem) {
							var _elem = [];
							
							layerItem.points.forEach(function(point) {
								if( point.isActive) {
									_param._history.itemsList[layerKey].push({
										point: point,
										before: {
											x: point.x,
											y: point.y
										}
									});
									
									var _pos = {
										x: point.x - _anchor.x,
										y: point.y - _anchor.y
									};
									
									_elem.push({
										point: point,
										x: _pos.x *_sCosA - _pos.y *_sSinA,
										y: _pos.x *_sSinA + _pos.y *_sCosA
									});
								}
								
							});
							
							_itemList[layerKey].push(_elem);
						});
					}
					
					_OnMouseMove = function(event) {
						var _endPos = {
							x: event.layerX/_zoom,
							y: event.layerY/_zoom
						};
						
						var _vec = { x: _endPos.x-_anchor.x, y: _endPos.y-_anchor.y};
						var _vecLength = Math.sqrt( Math.pow(_vec.x,2) + Math.pow(_vec.y,2) );
						
						var _cosA = _vec.x /_vecLength;
						var _sinA = _vec.y /_vecLength;
						
						// var _cosA = 1;
						// var _sinA = 0;
						
						// var _angle = Math.acos(_cosA)*(180/Math.PI);
						// if( _vec.y > 0) _angle = _angle * -1;
						// console.log(_angle);
						
						// var _cosA = Math.cos(_angle*Math.PI/180);
						// var _sinA = Math.sin(_angle*Math.PI/180);
						
						
						for(var layerKey in _itemList) {
							_itemList[layerKey].forEach(function(item) {
								item.forEach(function(elem) {
									elem.point.MoveTo(
										elem.x *_cosA - elem.y *_sinA +_anchor.x,
										elem.x *_sinA + elem.y *_cosA +_anchor.y
									);
									
								});
							});
							
							ave.layersList.items[layerKey]._PathBuild();
							
						}
						
						
					};
					
					_OnMouseUp = function() {
						for(var layerKey in _param._history.itemsList) {
							_param._history.itemsList[layerKey].forEach(function(item) {
								item.after = {
									x: item.point.x,
									y: item.point.y
								}
							});
						}
						
						
						
						ave.history.AddEvent(_param._history);
						
						document.removeEventListener("mousemove", _OnMouseMove);
						document.removeEventListener("mouseup", _OnMouseUp);
					};
					
					break;
				}
				
				break;
			}
			
			if( _OnMouseMove) {
				
				if( !_OnMouseUp) {
					_OnMouseUp = function() {
						document.removeEventListener("mousemove", _OnMouseMove);
						document.removeEventListener("mouseup", _OnMouseUp);
					};
				}
				
				document.addEventListener("mousemove", _OnMouseMove);
				document.addEventListener("mouseup", _OnMouseUp);
			}
			
		},
		
		zoom: {
			plus: function() {
				ave.bars.scene.workSpace.zoom += 0.1;
			},
			minus: function() {
				ave.bars.scene.workSpace.zoom -= 0.1;
			},
		}
	
	},
	
	layersList: {
		button: {
			Layer: function() {
				var _layer = ave.layersList.Create();
				
				ave.history.AddEvent({
					type: 'createLayer',
					layer: _layer,
					index: 0,
					parent: undefined
				});
				
				ave.controller.scene.tools.mode = 'Pen';
			},
			
			Group: function() {
				var _hierarchyList = [];
				
				var _group = ave.groupsList.Create();
				
				var _hierarchy = ave.controller._prefab.PositOfHierarchy();
				
				var _isFirst = true;
				var _Sort = function( group) {
					for(var ind in group) {
						if( Array.isArray( group[ind] ) ) {
							_Sort( group[ind]);
						} else {
							var _itemInd;
							if( group[ind]._parent) {
								_itemInd = group[ind]._parent.items.indexOf( group[ind]);
							} else {
								_itemInd = ave.hierarchy.items.indexOf( group[ind])
							}
							
							if( _isFirst) {
								_group.InsertTo(_itemInd, group[ind]._parent);
								_isFirst = false;
							}
							
							// History add
							_hierarchyList.push({
								item: group[ind],
								index: _itemInd,
								parent: group[ind]._parent
							});
							// -----
							
							group[ind].Remove();
							group[ind].InsertTo( _group.items.length, _group);
						}
					}
				}
				if( _hierarchy.length != 0) {
					_Sort(_hierarchy);
				} else {
					_group.InsertTo(0);
				}
				
				ave.edit.SelectOneGroup( _group);
				
				ave.history.AddEvent({
					type: 'createGroup',
					newGroup: _group,
					hierarchyList: _hierarchyList
				});
			},
			
			Delete: function() {
				var _hierarchyList = [];
				var _layerItemsList = [];
				
				// Layers
				ave.edit._layers.forEach( function( _layer) {
					var _layerInd;
					
					if( !_layer._parent) {
						_layerInd = ave.hierarchy.items.indexOf( _layer);
					} else {
						_layerInd = _layer._parent.items.indexOf( _layer);
					}
					
					_hierarchyList.push({
						element: _layer,
						index: _layerInd,
						parent: _layer._parent
					});
					
					
					ave.edit.RemoveItemsInLayer( _layer.id);
					ave.edit.RemoveLayer( _layer.id);
					
					ave.layersList.Remove( _layer.id);
				});
				
				// LayerItems
				for(var key in ave.edit._itemsStack) {
					var _layer = ave.layersList.items[key];
					_layerItemsList[key] = [];
					for(var stackLen=ave.edit._itemsStack[key].length; stackLen>0; stackLen--) {
						var _item = ave.edit._itemsStack[key][0];
						
						_layerItemsList[key].push({
							item: _item,
							index: _item.index
						});
						
						ave.edit.RemoveItem( key, _item.index);
						_layer.RemoveItem(_item);
					}
					_layer._PathBuild();
				}
				
				ave.edit._layers = [];
				
				// Group
				ave.edit._groups.forEach( function( _group) {
					var _groupInd;
					
					if( !_group._parent) {
						_groupInd = ave.hierarchy.items.indexOf( _group);
					} else {
						_groupInd = _group._parent.items.indexOf( _group);
					}
					
					_hierarchyList.push({
						element: _group,
						index: _groupInd,
						parent: _group._parent
					});
					
					ave.edit.RemoveGroup( _group.id);
					ave.groupsList.Remove( _group.id);
				});
				
				ave.edit._groups = [];
				
				ave.history.AddEvent({
					type: 'removeHierarchyItems',
					hierarchyList: _hierarchyList,
					layerItemsList: _layerItemsList
				});
			},
		},
		
		_MouseLeft: function(event) {
			var _element, _layerItem;
			var _Click = function() {};
			
			var _target = event.target;
			var _param = _target.id.split('+');
			
			if(!_param.length) { return;}
			
			switch(_param[0]) {
			case 'layerEye':
				var _type = _target.parentNode.id.split('+')[0];
				var _ElementId = _target.parentNode.id.split('+')[1];
				
				switch(_type) {
				case 'ave-group':
					_element = ave.groupsList.items[_ElementId];
					
					_Click = function() {
						if(_target.className.indexOf('eyeActive') > -1) {
							grnch.RemoveClass(_target, 'eyeActive');
							_element.nodes.scene.contentGroup.style.display = 'none';
						} else {
							_target.className += ' eyeActive';
							_element.nodes.scene.contentGroup.style.display = 'block';
						}
					}
					break;
				case 'ave-layer':
					_element = ave.layersList.items[_ElementId];
					
					_Click = function() {
						if(_target.className.indexOf('eyeActive') > -1) {
							grnch.RemoveClass(_target, 'eyeActive');
							_element.nodes.scene.content.style.display = 'none';
						} else {
							_target.className += ' eyeActive';
							_element.nodes.scene.content.style.display = 'block';
						}
					}
					break;
				}
				break;
			case 'layerName':
			case 'layerType':
				_target = _target.parentNode;
			case 'layerArea':
				var _type = _target.parentNode.id.split('+')[0];
				switch(_type) {
				case 'ave-group':
					var _groupId = _target.parentNode.id.split('+')[1];
					_element = ave.groupsList.items[_groupId];
					
					_Click = function() {
						if(_target.className.indexOf('itemAreaActive') > -1) {
							if(	event.ctrlKey) {
								ave.edit.RemoveGroup(_element);
							} else {
								ave.edit.SelectOneGroup(_element);
							}
						} else {
							if( event.ctrlKey) {
								ave.edit.AddGroup(_element);
							} else {
								ave.edit.SelectOneGroup(_element);
							}
						}
					}
					break;
				case 'ave-layer':
					var _layerId = _target.parentNode.id.split('+')[1];
					_element = ave.layersList.items[_layerId];
					
					_Click = function() {
						if(	event.ctrlKey) {
							if(_target.className.indexOf('itemAreaActive') > -1) {
								ave.edit.RemoveLayer(_element);
							} else {
								ave.edit.AddLayer(_element);
							}
						} else {
							ave.edit.SelectOneLayer(_element);
						}
					}
					break;
				}
				break;
			case 'layerFolder': 
				_target = _target.parentNode.parentNode;
				var _param = _target.id.split('+');
				
				switch( _param[0]) {
				case 'ave-group':
					_element = ave.groupsList.items[ _param[1] ];
					break;
				case 'ave-layer':
					_element = ave.layersList.items[ _param[1] ]
					break;
				}
				
				_Click = function() {
					_element.FolderEvent();
				};
				break;
			case 'layerChildSwitcher':
				var _itemId = _target.parentNode.id.split('+')[1];
				
				_layerItem = ave.layerItemsList.items[_itemId];
				_element = _layerItem._parent;
				
				_Click = function() {
					_layerItem.isActive = !_layerItem.isActive;
					
					_element._PathBuild();
				}
				break;
			case 'layerChildName':
				_target = _target.parentNode;
			case 'layerChild':
				var _itemId = _target.id.split('+')[1];
				
				_layerItem = ave.layerItemsList.items[_itemId];
				_element = _layerItem._parent;
				
				_Click = function() {
					if(_target.className.indexOf('itemAreaActive') > -1) {
						if(	event.ctrlKey) {
							ave.edit.RemoveItem( _layerItem);
						} else {
							ave.edit.SelectOneItem( _layerItem);
						}
						
					} else {
						if( event.ctrlKey) {
							ave.edit.AddItem( _layerItem);
						} else {
							ave.edit.SelectOneItem( _layerItem);
						}
				
					}
				}
				break;
				default: 
					return;
			}
			
			
			var _start = {
				x: event.screenX,
				y: event.screenY
			};
			
			var _isMove = false;
			var _moveElements = [];
			var _hierarchyList = [];
			
			var _OnMouseMove = function( event) {
				var _vec = {
					x: event.screenX - _start.x,
					y: event.screenY - _start.y
				}
				
				if( !_isMove) {
					var _vecLength = Math.abs( Math.sqrt(_vec.x * _vec.x + _vec.y * _vec.y) );
					if( _vecLength > 5) {
						if( _layerItem != undefined) {
							document.removeEventListener("mousemove", _OnMouseMove);
							document.removeEventListener("mouseup", _OnMouseUp);
							return;
						}
						
						_isMove = true;
						
						var _openLayers = ave.edit._openLayers;
						for(var ind=0, len=_openLayers.length; ind<len; ind++) {
							_openLayers[ind].FolderEvent();
						}
						
						var _isNewSelect = false;
						switch( _element.type) {
						case 'Group':
							if( ave.edit._groups.indexOf(_element) == -1) {
								ave.edit.SelectOneGroup( _element);
								_moveElements.push( _element);
								_isNewSelect = true;
							}
							break;
						case 'Layer':
							if( ave.edit._layers.indexOf(_element) == -1) {
								_moveElements.push( _element);
								ave.edit.SelectOneLayer( _element);
								_isNewSelect = true;
							}
							break;
						}
						
						if( !_isNewSelect) {
							var _startInd;
							
							var _SwitchOffParent = function( element) {
								if( element) {
									if( ave.edit._groups.indexOf(element) != -1) {
										ave.edit.RemoveGroup( element);
									}
									_SwitchOffParent(element._parent);
								}
							};
							
							if( _element._parent) {
								_SwitchOffParent(_element._parent);
								_startInd = _element._parent.items.indexOf(_element);
							} else {
								_startInd = ave.hierarchy.items.indexOf(_element);
							}
							
							var _hierarchy = ave.controller._prefab.PositOfHierarchy();
							
							var _Sort = function( group) {
								for(var ind in group) {
									if( Array.isArray( group[ind] ) ) {
										_Sort( group[ind]);
									} else {
										// History add
										var _itemInd;
										if( group[ind]._parent) {
											_itemInd = group[ind]._parent.items.indexOf( group[ind]);
										} else {
											_itemInd = ave.hierarchy.items.indexOf( group[ind])
										}
										
										_hierarchyList.push({
											item: group[ind],
											index: _itemInd,
											parent: group[ind]._parent
										});
										// -----
							
										_moveElements.push( group[ind]);
									}
								}
							}
							_Sort(_hierarchy);
							
							var _isAfter = false;
							for(var ind=0, len=_moveElements.length; ind<len; ind++){
								if( _moveElements[ind] == _element) {
									_isAfter = true;
									continue;
								}
								
								
								if( _moveElements[ind]._parent == _element._parent) {
									var _indOf, _elemInd;
									if( _element._parent) {
										_indOf = _element._parent.items.indexOf(_moveElements[ind]);
									} else {
										_indOf = ave.hierarchy.items.indexOf(_moveElements[ind]);
									}
									
									if(	_indOf < _startInd) {
										_moveElements[ind].Remove();
										_moveElements[ind].InsertTo( _startInd-1, _element._parent);
										continue;
									}
								}
								
								_moveElements[ind].Remove();
								if( !_isAfter) {
									_moveElements[ind].InsertTo( _startInd++, _element._parent);
								} else {
									_moveElements[ind].InsertTo( ++_startInd, _element._parent);
								}
							}
						}
						
						_element = _moveElements[0];
					} else {
						return;
					}
				}
				
				var _SwapOut = function( moveInd) {
					var _parentInd;
					var _secondParent;
					var _parentObj = _element._parent._parent;
					if( _parentObj) {
						_secondParent = _parentObj.items;
					} else {
						_secondParent = ave.hierarchy.items;
					}
					_parentInd = _secondParent.indexOf(_element._parent);
					for(var elemInd=_moveElements.length-1; elemInd>-1; elemInd--) {
						_moveElements[elemInd].Remove();
						_moveElements[elemInd].InsertTo( _parentInd+moveInd, _parentObj);
					}
				};
				
				var _SwapIn = function( moveInd, group) {
					var _ind = moveInd;
					if( _ind != 0) {
						_ind = group.items.length;
					}
					
					for(var elemInd=_moveElements.length-1; elemInd>-1; elemInd--) {
						_moveElements[elemInd].Remove();
						_moveElements[elemInd].InsertTo( _ind, group);
					}
				}
				
				var _swap = parseInt(_vec.y / 40);
				if( _swap == 0) { return;}
				
				var _startInd;
				var _parentList;
				
				if( _element._parent) {
					_parentList = _element._parent.items;
				} else {
					_parentList = ave.hierarchy.items;
				}
				_startInd = _parentList.indexOf(_element);
				
				var _item;
				
				if( _swap < 0) {
					if( _startInd == 0) {
						if( !_element._parent) {
							return;
						}
						_SwapOut(0);
					} else {
						_item = _parentList[_startInd-1];
						
						if( _item.type == 'Group'
							&& _item._isFolder
						){
							_SwapIn(1, _item);
						} else {
							_item.Remove();
							_item.InsertTo( _startInd+_moveElements.length-1, _element._parent);
						}
					}
				}
				
				
				if( _swap > 0) {
					if( _startInd+_moveElements.length >= _parentList.length) {
						if( !_element._parent) {
							return;
						}
						_SwapOut(1);
					} else {
						_item = _parentList[_startInd+_moveElements.length];
						if( _item.type == 'Group'
							&& _item._isFolder
						){
							_SwapIn(0, _item);
						} else {
							_item.Remove();
							_item.InsertTo( _startInd, _element._parent);
						}
					}
				}
				
				_start.y += 40*_swap;
			}
			
			var _OnMouseUp = function() {
				document.removeEventListener("mousemove", _OnMouseMove);
				document.removeEventListener("mouseup", _OnMouseUp);
				
				if( !_isMove) {
					_Click();
				} else {
					var _newInd;
					if( _element._parent) {
						_newInd = _element._parent.items.indexOf(_element);
					} else {
						_newInd = ave.hierarchy.items.indexOf( _element)
					}
					
					ave.history.AddEvent({
						type: 'swapHierarchyItems',
						newParent: _element._parent,
						newIndex: _newInd,
						hierarchyList: _hierarchyList
					});
				}
			};
			
			document.addEventListener("mousemove", _OnMouseMove);
			document.addEventListener("mouseup", _OnMouseUp);
		},
		
		_MouseMiddle: function(event) {
			var _element;
			
			var _target = event.target;
			var _param = _target.id.split('+');
			
			if(!_param.length) { return;}
			
			switch(_param[0]) {
			case 'layerEye':
				var _type = _target.parentNode.id.split('+')[0];
				var _ElementId = _target.parentNode.id.split('+')[1];
				
				switch(_type) {
				case 'ave-group':
					_element = ave.groupsList.items[_ElementId];
					break;
				case 'ave-layer':
					_element = ave.layersList.items[_ElementId];
					break;
				}
				break;
			case 'layerName':
			case 'layerType':
				_target = _target.parentNode;
			case 'layerArea':
				var _type = _target.parentNode.id.split('+')[0];
				switch(_type) {
				case 'ave-group':
					var _groupId = _target.parentNode.id.split('+')[1];
					_element = ave.groupsList.items[_groupId];
					break;
				case 'ave-layer':
					var _layerId = _target.parentNode.id.split('+')[1];
					_element = ave.layersList.items[_layerId];
					break;
				}
				break;
			case 'layerFolder': 
				_target = _target.parentNode.parentNode;
				var _param = _target.id.split('+');
				
				switch( _param[0]) {
				case 'ave-group':
					_element = ave.groupsList.items[ _param[1] ];
					break;
				case 'ave-layer':
					_element = ave.layersList.items[ _param[1] ]
					break;
				}
				break;
			// case 'layerChildSwitcher':
				// var _itemInd = _target.parentNode.id.split('+')[1];
				// var _layerId = _target.parentNode.parentNode.parentNode.parentNode.id.split('+')[1];
				
				// _element = ave.layersList.items[_layerId];
				// var _item = _element.itemsList[_itemInd];
				// break;
			// case 'layerChildName':
				// _target = _target.parentNode;
			// case 'layerChild':
				// var _itemInd = _target.id.split('+')[1];
				// var _layerId = _target.parentNode.parentNode.parentNode.id.split('+')[1];
				
				// _element = ave.layersList.items[_layerId];
				// var _item = _element.itemsList[_itemInd];
				// break;
			default: 
				// return;
			}
			
			event.preventDefault();
			if( !_element) return;
			_element.FolderEvent();
			
		},
		
		_contextMenu: {
			element: undefined,
			
			OpenFolder: function() {
				this.element.FolderEvent();
				ave.bars.contextMenu.Close();
			},
			
			Select: function() {
				var _element = this.element;
				var _isActive = _element.nodes.layersList.area.className.indexOf('itemAreaActive') > -1;
				
				switch( _element.type) {
				case 'Group':
					if(	_isActive) {
						ave.edit.RemoveGroup(_element);
					} else {
						ave.edit.AddGroup(_element);
					}
					break;
				case 'Layer':
					if(	_isActive) {
						ave.edit.RemoveLayer(_element);
					} else {
						ave.edit.AddLayer(_element);
					}
					break;
				}
				
				
				ave.bars.contextMenu.Close();
			},
			
			Rename: function() {
				this.element.Rename();
				
				ave.bars.contextMenu.Close();
			},
			
			SelectLayerItem: function() {
				var _element = this.element;
				var _isActive = _element.nodes.layersList.item.className.indexOf('itemAreaActive') > -1;
				
				if(	_isActive) {
					ave.edit.RemoveItem(_element);
				} else {
					ave.edit.AddItem(_element);
				}
				
				ave.bars.contextMenu.Close();
			},
			
			CheckAnimLayerItem: {
				CreateAnimPath: function() {
					var _element = ave.controller.layersList._contextMenu.element;
					
					if( _element.animPath) return;

					_element.animPath = new ave.prefabs.animPath.LayerItem({
						item: _element
					});
					
					var _pointsAnimPath = [];
					_element.points.forEach(function(point, ind) {
						point.animPath = new ave.prefabs.animPath.LayerItemPoint({
							point: point
						});
						
						point.animPath._PathBuild();
						
						_pointsAnimPath[ind] = point.animPath;
					});
					
					ave.history.AddEvent({
						type: 'createLayerItemAnimPath',
						layerItemAnimPath: _element.animPath,
						layerItemPointsAnimPath: _pointsAnimPath
					});
					
					ave.bars.contextMenu.Close();
				},
				
				All: function() {
					var _element = ave.controller.layersList._contextMenu.element;
					// this.CreateAnimPath();
					
					var _history = {
						type: 'reFrameAllPoints',
						layerItem: _element,
						frameNum: ave.animation.cursor
					};
					
					var _points = [];
					
					_element.points.forEach(function(point, ind) {
						_points[ind] = {};
						
						if( point.isActive) {
							_points[ind].after = {
								x: point.x,
								y: point.y
							};
						} else {
							_points[ind].after = {
								x: _element.points[0].x,
								y: _element.points[0].y
							};
						}
						
						if( point.animPath.frames[ave.animation.cursor]) {
							_points[ind].before = {
								x: point.animPath.frames[ave.animation.cursor].points[0].x,
								y: point.animPath.frames[ave.animation.cursor].points[0].y
							};
							
							point.animPath.frames[ave.animation.cursor].points[0].MoveTo( _points[ind].after.x, _points[ind].after.y);
						} else {
							point.animPath.AddFrame({
								x: _points[ind].after.x,
								y: _points[ind].after.y
							});
							
						}
						
						_points[ind].frame = point.animPath.frames[ave.animation.cursor];
						point.animPath._PathBuild();
					});
					
					
					_history.points = _points;
					ave.history.AddEvent(_history);
					
					_element.animPath.ReFrames();
					
					ave.bars.contextMenu.Close();
				}
				
			}
		},
		
		_MouseRight: function(event) {
			event.preventDefault();
			
			var _element, _item;
			
			var _target = event.target;
			var _param = _target.id.split('+');
			
			if(!_param.length) { return;}
			
			switch(_param[0]) {
			case 'layerEye':
				var _type = _target.parentNode.id.split('+')[0];
				var _ElementId = _target.parentNode.id.split('+')[1];
				
				switch(_type) {
				case 'ave-group':
					_element = ave.groupsList.items[_ElementId];
					break;
				case 'ave-layer':
					_element = ave.layersList.items[_ElementId];
					break;
				}
				break;
			case 'layerName':
			case 'layerType':
				_target = _target.parentNode;
			case 'layerArea':
				var _type = _target.parentNode.id.split('+')[0];
				switch(_type) {
				case 'ave-group':
					var _groupId = _target.parentNode.id.split('+')[1];
					_element = ave.groupsList.items[_groupId];
					break;
				case 'ave-layer':
					var _layerId = _target.parentNode.id.split('+')[1];
					_element = ave.layersList.items[_layerId];
					break;
				}
				break;
			case 'layerFolder': 
				_target = _target.parentNode.parentNode;
				var _param = _target.id.split('+');
				
				switch( _param[0]) {
				case 'ave-group':
					_element = ave.groupsList.items[ _param[1] ];
					break;
				case 'ave-layer':
					_element = ave.layersList.items[ _param[1] ]
					break;
				}
				break;
			// Layer Item
			case 'layerChildSwitcher':
			case 'layerChildName':
				_target = _target.parentNode;
			case 'layerChild':
				var _itemId = _target.id.split('+')[1];

				_item = ave.layerItemsList.items[_itemId];
				_element = _item._parent;
				break;
			default: 
				return;
			}
			
			if( _item) {
				this._contextMenu.element = _item;
				
				ave.bars.contextMenu.Open('layersListItem', event);
				return;
			}
			
			if(	_element) {
				this._contextMenu.element = _element;
				
				ave.bars.contextMenu.Open('layersList', event);
				return;
			}
			
		},
		
		OnMouseDown: function(event) {
			switch(	event.button) {
			case 0:
				ave.controller.layersList._MouseLeft(event)
				break;
			case 1:
				ave.controller.layersList._MouseMiddle(event)
				break;
			case 2:
				ave.controller.layersList._MouseRight(event)
				break;
			}
			
		}
		
	},
	
	transform: {
		start: function() {},
		end: function() {},
		cancel: function() {}
	},
	
	animation: {
		Play: function() {
			if( grnch._anims['timelinePlay']) return;
			
			var _filmLength = ave.animation.timeLength/1000 *ave.animation.fps;
			
			var _Anim = function() {
				grnch.AddAnim({ 
					key: 'timelinePlay',
					time: ave.animation.timeLength,
					process: function(prog) {
						var _currFrame = Math.floor(_filmLength*prog);
						ave.animation.GoToFrame(_currFrame);
					},
					callback: _Anim
				});

			};
			
			_Anim();
		},
		
		Pause: function() {
			if( !grnch._anims['timelinePlay']) return;
			delete grnch._anims['timelinePlay'];
		},
		
		Stop: function() {
			if( !grnch._anims['timelinePlay']) return;
			delete grnch._anims['timelinePlay'];
			ave.animation.GoToFrame(0);
		},
		
		options: {
			settings: {
				Open: function() {
					ave.bars.blackout.show();
					ave.bars.animSettings.show();
				},
				
				Close: function() {
					ave.bars.animSettings.hide();
					ave.bars.blackout.hide();
				},
				
				Save: function( fps, time) {
					console.log( typeof(fps), typeof(time) );
					
					if( true) {
						ave.bars.animSettings.hide();
						ave.bars.blackout.hide();
					}
				},
				
			}
			
		},
		
		itemsList: {
			OnMouseDown: function(event) {
				var _target = event.target;
				var _layerItem;
				var _pointInd;
				
				var _targetId = _target.id.split('+')[0];
				
				switch(_targetId) {
				case 'ave-animList-childType':
				case 'ave-animList-addbtn':
				case 'ave-animList-childName':
					_target = _target.parentNode;
				case 'ave-animList-itemPoint':
					_pointInd = Number(_target.id.split('+')[1]);
					_target = _target.parentNode;
				case 'ave-animList-itemName':
					_target = _target.parentNode;
				case 'ave-animList-itemArea':
					var _layerItemId = _target.id.split('+')[1];
					_layerItem = ave.layerItemsList.items[_layerItemId];
				}
				
				switch(_targetId) {
				case 'ave-animList-itemArea':
					break;
				case 'ave-animList-itemName':
					break;
				case 'ave-animList-itemPoint':
				case 'ave-animList-childName':
					var _point = _layerItem.points[_pointInd];
					if(	_point.animPath) {
						if( _point.animPath.isSelect) {
							_point.animPath.OffSelect();
						} else {
							_point.animPath.OnSelect();
						}
					}
					break;
				case 'ave-animList-childType':
					break;
				case 'ave-animList-addbtn':
					var _point = _layerItem.points[_pointInd];
					
					var _history = {
						type: 'reFramePoint'
					};
					
					if( _point.animPath.frames[ave.animation.cursor]) {
						_history.before = {
							x: _point.animPath.frames[ave.animation.cursor].points[0].x,
							y: _point.animPath.frames[ave.animation.cursor].points[0].y
						}
						
						_point.animPath.frames[ave.animation.cursor].points[0].MoveTo( _point.x, _point.y);
						
					} else {
						var _pos;
						if(	_point.isActive) {
							_pos = {
								x: _point.x,
								y: _point.y
							};
						} else {
							_pos = {
								x: _layerItem.points[0].x,
								y: _layerItem.points[0].y
							};
						}
						
						_point.animPath.AddFrame({
							x: _pos.x,
							y: _pos.y
						});
						
					}
					
					_history.after = {
						x: _point.x,
						y: _point.y
					};
					
					_history.frame = _point.animPath.frames[ave.animation.cursor];
					
					ave.history.AddEvent(_history);
					
					_point.animPath._PathBuild();
					_layerItem.animPath.ReFrames();
					break;
				
				}
				
			},
			
		},
		
		timeline: {
			OnMouseDown: function(event) {
				var _OnMouseMove;
				var _Callback = function() {};
				
				var _target = event.target;
				var _layerItem;
				var _pointInd;
				var _frameInd;
				
				var _targetId = _target.id.split('+')[0];
				
				switch(_targetId) {
				case 'ave-animArea-itemFrame':
					_frameInd = Number(_target.id.split('+')[1]);
					_target = _target.parentNode;
				case 'ave-animArea-timeline':
					_pointInd = Number(_target.id.split('+')[1]);
					_target = _target.parentNode;
				case 'ave-animArea-itemGroup':
					var _layerItemId = _target.id.split('+')[1];
					_layerItem = ave.layerItemsList.items[_layerItemId];
					break;
				}
				
				switch(_targetId) {
				case 'ave-animArea-itemFrame':
					var _anim = ave.animation;
					var _framesLength = parseInt(_anim.timeLength/1000*_anim.fps)+1;
					var _frame = _layerItem.points[_pointInd].animPath.frames[_frameInd];
				
					var _startPos = event.screenX;
					var _startFrame = event.layerX-5;
				
					_OnMouseMove = function(event) {
						var _timePos = parseInt( (event.screenX - _startPos + _startFrame)/10 );
						if( _timePos < 0) _timePos = 0;
						if( _timePos > _framesLength) _timePos = _framesLength;
						
						_frame.Reorder(_timePos);
						
						_layerItem.points[_pointInd].animPath._PathBuild();
						_layerItem.animPath.ReFrames();
						ave.animation.ClickTimeline();
					};
					
					_Callback = function() {
						ave.history.AddEvent({
							type: 'frameMove',
							frame: _frame,
							before: _frameInd,
							after: _frame._index
						});
					};
					
					break;
				}
				
				
				var _OnMouseUp = function() {
					_Callback();
					
					if( _OnMouseMove) document.removeEventListener("mousemove", _OnMouseMove);
					document.removeEventListener("mouseup", _OnMouseUp);
				};
				
				if( _OnMouseMove) document.addEventListener("mousemove", _OnMouseMove);
				document.addEventListener("mouseup", _OnMouseUp);
				
				
			}
		}
	}
	
};
})();