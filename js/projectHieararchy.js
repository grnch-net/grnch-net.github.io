	ave: {
+		_xmlns: 'string',

+		docReady: function() {},
		
+		prefabs: {
	+		Group: function( id:'String') {},
	
	+		Layer: function( id:'String') {},
			
			/* 	param: {
					x: 'Number',
					y: 'Number',
					(
						x1: 'Number',
						y1: 'Number',
						x2: 'Number',
						y2: 'Number'
					)
				}
			*/
	+		LayerItem: function( param:'Object') {},
			
			AnimPath: function() {},
			
			/* 	param: {
					type: 'Char', 	// ( M, L, Q, C)
					x: 'Number',
					y: 'Number',
					(
						x1: 'Number',
						y1: 'Number',
						x2: 'Number',
						y2: 'Number',
					)
				}
			*/
			AnimPathFrame: function( param:'Object') {}
			
		},
		
+		interface: {
	+		layer: {
		+		_PathBuild =  function() {},
		+		InsertItemBefore = function(index:'Number', newItem:'LayerItem') {};
		-		ReplaceItem = function(index:'Number', newItem:'LayerItem') {};
		+		RemoveItem = function(item: 'LayerItem') {};
		+		AppendItem = function(newItem: 'LayerItem') {}
			}
			
		-	animPath: {
				ReplaceFrame: function(index:'Number', newItem:'AnimPathItem') {},
				RemoveFrame: function(index:'Number') {},
				AddFrame: function(newItem:'AnimPathItem') {},
				RemoveAnimPath: function() {}
			},
			
		-	animPathFrame: {
				// SwitchType: function(newType:'Number'),
				ReplaceInTimeline: function(newFrame:'Number')
			}
		},
		
+		edit: {
	+		_layers: [],
	+		SelectOneLayer: function(layerId:'String') {},
	+		AddLayer: function(layerId:'String') {},
	+		RemoveLayer: function(layerId:'String') {},
	+		RemoveAllLayers: function() {},
			
	+		_itemsStack: {},
	+		_AddItemStack: function(item: 'LayerItem') {},
	+		_RemoveItemStack: function(item: 'LayerItem') {},
			
	+		_items: {},
	+		SelectOneItem: function(layerId:'String', itemInd:'Number') {},
	+		AddItem: function(layerId:'String', itemInd:'Number') {},
	+		RemoveItem: function(layerId:'String', itemInd:'Number') {},
	+		RemoveItemsInLayer: function( layerId:'String') {},
	+		RemoveAllItem: function() {},
			
	-		comeback: {
				history: []
			}
		},
		
	-	superGroupsList: {
			...
		},
		
	+	hierarchy: [],
		
		groupsList: {
	+		Create: function( layerId:'String') {
				return 'LayerItem';	// Layer object
			},
			
	+		Remove: function( layerId:'String') {},
			
	+		items: {}
		}
		
+		layersList: {
	+		CreateLayer: function( layerId:'String') {
				return 'LayerItem';	// Layer object
			},
			
	+		RemoveLayer: function( layerId:'String') {},
			
	+		items: {
		+	|	'layer id': {
			|	+	_proto_: ave.interface.layer,
			|
			|	+	type: 'String',
			|	+	id: 'String',
			|	+	isClosed: 'Boolean',
			|
			|	+	nodes: {
			|			layersList: {
			|				item: 'Node',
			|				area: 'Node',
			|				itemsList: 'Node',
			|			},
			|			scene: {
			|				content: 'Node',
			|				labelGroup: 'Node',
			|				itemPathGroup: 'Node',
			|				layerPath: 'Node'
			|			}
			|		},
			|
			|		style: {
			|			_fill: 'String',
			|			get fill() {},
			|			set fill(val:'String') {},
			|			_stroke: 'String',
			|			get stroke() {},
			|			set stroke(val:'String') {},
			|			_strokeWidth: 'Number',
			|			get _strokeWidth() {},
			|			set _strokeWidth(val:'String') {},
			|		},
			|
			|		_isFolder: 'Boolean',
			|		FolderEvent: function() {},
			|
			|	+	itemsList: [
			|		|	{
			|		|		_proto_: ave.interface.layerItem,
			|		|		_parent: 'String', // Layer ID
			|		|		_index: 'Number',
			|		|		_sceneProtoUse: undefined || 'Node',
			|		|
			|		|		isActive: 'Boolean',
			|		|
			|		|		nodes:  {
			|		|			layersList: {
			|		|				item: 'Node',
			|		|				name: 'Node'
			|		|			},
			|		|			scene: {
			|		|				group: 'Node',
			|		|				supGroup: 'Node',
			|		|				beforeSupGroup: 'Node',
			|		|				afterSupGroup: 'Node',
			|		|				supPolyline: 'Node',
			|		|				itemPath: 'Node'
			|		|			}
			|		|		},
			|		|		
			|		|		points: [
			|		|		|	{
			|		|		|		_x: 'Number',
			|		|		|		_y: 'Number',
			|		|		|
			|		|		|		nodes: {
			|		|		|			scenePoint: 'Node',
			|		|		|			sceneAnimPathGroup: 'Node',
			|		|		|		},
			|		|		|
			|		|		|		animPath: (undefined) / {
			|		|		|			_proto_: ave.interface.animPath,
			|		|		|
			|		|		|			node: {
			|		|		|				hierarchyItem: 'Node',
			|		|		|				hierarchyPointsList: 'Node',
			|		|		|				timeline: 'Node',
			|		|		|				timelinesGroup: 'Node',
			|		|		|				scenePointsGroup: 'Node',
			|		|		|				SVGPath: 'Node',
			|		|		|			},
			|		|		|
			|		|		|			frames: {
			|		|		|			|	'frame index': {
			|		|		|			|		_proto_: ave.interface.animPathFrame,
			|		|		|			|		
			|		|		|			|		// type: 'Char', ( M, L, Q, C),
			|		|		|			|		
			|		|		|			|		points: [
			|		|		|			|		|	{			
			|		|		|			|		|		_x: 'Number',
			|		|		|			|		|		get x() {},
			|		|		|			|		|		set x('Number') {},
			|		|		|			|		|
			|		|		|			|		|		_y: 'Number',
			|		|		|			|		|		get y() {},
			|		|		|			|		|		set y('Number') {},
			|		|		|			|		|
			|		|		|			|		|		nodes: {
			|		|		|			|		|			hierarchyItem: 'Node',
			|		|		|			|		|			scenePoint: 'Node',
			|		|		|			|		|			timeline: 'Node',
			|		|		|			|		|		}
			|		|		|			|		|	},
			|		|		|			|		|	...
			|		|		|			|		]
			|		|		|			|	},
			|		|		|			|	...
			|		|		|			}
			|		|		|		}
			|		|		|	},
			|		|		|	...
			|		|		]
			|		|	},
			|		|	...
			|		]
			|	},
			|	...
			}
		},
		
		anim: {
			isActive: 'Boolean',	// статус модуля
			
			Play: function() {},	// проиграть анимацию 1 раз, старт с 0го кадра
			PlayLoop: function() {},	// проигрывать анимацию по не будет остановлена пользователем, старт с 0го кадра
			Stop: function() {},	// остановить проигрование анимации
			
			nodes: {
				
			},	
			
			edit: {
				_animPathId: 'String',
				get animPathId() {},
				set animPathId( newPathId:'String'),
				
				_frameIndex: 'Number',
				get itemIndex() {},
				set itemIndex( newFrameIndex:'Number') {},
				
				_pointIndex: 'Number',
				get pointIndex() {},
				set pointIndex( newPointIndex:'Number') {}
			},
			
			param: {
				_fps: 'Number',
				get fps() {},
				set fps(newFPS:'Number') {},
				
				_stepTime: 'Number',	// время между кадрами
				
				_filmLength: 'Number', 	// кол-во кадров
				get filmLength() {},
				set filmLength(newLength:'Number') {},
				
				_cursorFramePosition: 'Number',	// текущий выбраный кадр
				get frameCursorPosition() {},
				set frameCursorPosition(newPos:'Number') {},
				
				_mouseFramePosition:'Number',	// текущий в фокусе кадр
				get mouseFramePosition() {},
				set mouseFramePosition( newPos:'Number') {},
			},
			
			_film: {
				'frame index': {
					'layer id': {
						'item index': {
							'point index': {
								x: 'Number',
								y: 'Number',
							},
							...
						},
						...
					},
					...
				},
				...
			},
			film: {
				/*	param: {
						frame: 'Number',
						pathId: 'String',
						itemIndex: 'Number',
						pointIndex: 'Number'
					}
				*/
				GetPoint: function( param:'Object') { return { x:'Number', y: 'Number'} },
				
				RewritePoint: function( pathId:'String', itemIndex:'Number', pointIndex:'Number') {},
				
				//Render: function(...) {}
			}
			
		},
		
+		controller: {
	+		_prefab: {
				moveTool: {
					_mode: 'String',
					get mode() {},
					set mode(val:'String') {},
					
					x: 0,
					y: 0,
					
					mouseDown: function() {}
				},
				
				penTool: {
					_mode: 'String',
					get mode() {},
					set mode(val:'String') {},
					
					mouseDown() {}
				}
				
			},
			
	+		lastMode: 'String',
	+		_mode: 'String',
	+		get mode() {},
	+		set mode(newMode:'String') {},
			
	+		project: {
		+		svg: {
			+		OnLoad: function() {},
			+		OpenLoadBar: function() {},
			+		CloseLoadBar: function() {},
					
			+		OpenSaveBar: function() {},
			+		CloseSaveBar: function() {}
				},
		-		animation: {
			-		Load: function(...) {},
			-		Save: function(...) {}
				},
			},
			
	+		scene: {
				zoom: {
					plus: function() {},
					minus: function() {},
				}
			},
			
	+		layersList: {
				DeleteButton: function() {},
				OnClick: function() {}
			},
			
	-		transformation: {
				start: function() {},
				end: function() {},
				cancel: function() {}
			}
			
		},
		
+		bars: {
	+		blackout: new grnch.Window('Object'),
	+		svgLoad: new grnch.Window('Object'),
	-		svgSave: new grnch.Window('Object'),
	-		optionsPanel: new grnch.Window('Object'),
	+		scene: new grnch.Window('Object'),
	+		layersList: new grnch.Window('Object'),
	-		tools: new grnch.Window('Object'),
	-		animation: new grnch.Window('Object')
		}
		
	}
