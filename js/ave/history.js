(function() {
'use strict'

ave.history = {
	AddEvent: function(param) {
		if( !param) { return; }
		
		switch(param.type) {
		/*	param: {
				type: 'createLayer',
				layer: 'hierarchyItem',
				index: 'Number',
				parent: undefined || 'groupItem'
			}*/
		case 'createLayer':
		
		/*	param: {
				type: 'createGroup',
				newGroup: 'Group',
				hierarchyList: [
					{
						item: 'Layer' || 'Group',
						index: 'Number',
						parent: undefined || 'Group'
					},
					...
				]
		}*/
		case 'createGroup':
		
		/*	param: {
				type: 'removeHierarchyItems'
				hierarchyList: [
					{
						item: 'Layer' || 'Group',
						index: 'Number',
						parent: undefined || 'Group'
					},
					...
				],
				layerItemsList: {
					'layerId': [
						{
							item: 'LayerItem',
							index: 'Number',
							parent:	'Layer'
						},
						...
					],
					...
				}
			}*/
		case 'removeHierarchyItems':
		
		/*	param: {
				type: 'swapHierarchyItems',
				newParent: 'Group',
				newIndex: 'Number',
				hierarchyList: [
					{
						item: 'Layer' || 'Group',
						index: 'Number',
						parent: undefined || 'Group'
					},
					...
				]
			}*/
		case 'swapHierarchyItems':
		
		/* 	param: {
				type: 'closeLayer',
				layers: Layer
			}*/
		case 'closeLayer':
		
		/* 	param: {
				type: 'createLayerItem',
				itemsList: [
					{
						*type: 'closeLayer',
						item: 'LayerItem',
						layer: 'Layer'
					},
					...
				]
			}*/
		case 'createLayerItem':
		
		/* 	param: {
				type: 'layerInsertItemBefore',
				layer: 'Layer',
				item: 'LayerItem',
				index: 'Number'
			}*/
		case 'layerInsertItemBefore':
		
		/* 	param: {
				type: 'layerItemRemove',
				layer: 'Layer',
				item: 'LayerItem',
				index: 'Number'
			}*/
		case 'layerItemRemove':
		
		/*	param: {
				type: 'layerItemsMove',
				itemsList: {
					'layerId': [
						{
							item: 'LayerItem',
							before: {
								x: 'Number',
								y: 'Number'
							},
							after: {
								x: 'Number',
								y: 'Number'
							}
						},
						...
					],
					...
				}
			}*/
		case 'layerItemsMove':
		
		/*	param: {
				type: 'layerItemsCurve',
				itemsList: [
					{
						item: 'LayerItem',
						before: {
							x1: 'Number',
							y1: 'Number',
							x2: 'Number',
							y2: 'Number'
						},
						after: {
							x1: 'Number',
							y1: 'Number',
							x2: 'Number',
							y2: 'Number'
						}

					},
					...
				]
			}*/
		case 'layerItemsCurve':
		
		/*	param: {
				type: 'fill',
				list: [
					{
						item: 'Layer' || 'Group',
						before: 'String'
					},
					...
				],
				after: 'String'
			}*/
		case 'fill':
		
		/*	param: {
				type: 'stroke',
				list: [
					{
						item: 'Layer' || 'Group',
						before: 'String'
					},
					...
				],
				after: 'String'
			}*/
		case 'stroke':
		
		/*	param: {
				type: 'strokeWidth',
				list: [
					{
						item: 'Layer' || 'Group',
						before: 'String'
					},
					...
				],
				after: 'String'
			}*/
		case 'strokeWidth':
		
		/*	param: {
				type: 'createLayerItemAnimPath',
				layerItemAnimPath: LayerItemAnimPath,
				layerItemPointsAnimPath: [LayerItemPointAnimPath,...]
			}*/
		case 'createLayerItemAnimPath':
		
		/*	param: {
				type: 'reFramePoint',
				frame: Frame,
				*before: {
					x: Number,
					y: Number
				},
				after: {
					x: Number,
					y: Number
				}
			}*/
		case 'reFramePoint':
		
		/*	param: {
				type: 'frameMove',
				frame: Frame,
				before: Number,
				after: Number
			}*/
		case 'frameMove':
		
		/*	param: {
				type: 'reFrameAllPoints',
				points: [
					{
						frame: Frame,
						before:{
							x: Number,
							y: Number
						},
						after: {
							x: Number,
							y: Number
						}
					},
					...
				]
			}*/
		case 'reFrameAllPoints':
		
		/*	param: {
				type: 'framePointMove',
				framePoint: framePoint,
				before: {
					x: Number,
					y: Number
				},
				after: {
					x: Number,
					y: Number
				}
			} */
		case 'framePointMove':
		
		/*	param: {
				type: 'framePointCurves',
				frame: frame,
				before: {
					x1: 'Number',
					y1: 'Number',
					x2: 'Number',
					y2: 'Number'
				},
				after: {
					x1: 'Number',
					y1: 'Number',
					x2: 'Number',
					y2: 'Number'
				}
			} */
		case 'framePointCurves':
		
		/*	param: {
				type: 'removeFrame',
				frame: Frame
			} */
		case 'removeFrame':
		
		/*	param: {
				type: 'transformRotate',
				itemList: {
					'layerId': [{
							point: LayerItemPoint,
							before: {
								x: Number,
								y: Number
							},
							after: {
								x: Number,
								y: Number
							}
						}, ...
					]
				}
			} */
		case 'transformRotate':
		
			for(var ind=this.items.length-1; ind>-1; ind--) {
				if( !this.items[ind].isActive) {
					this.items.splice(ind, 1);
				} else {
					break;
				}
			}
		
			param.isActive = true;
			this.items.push(param);
			break;
		default:
			console.error('History type is undefined.');
			return;
		}
	},
	
	cancel: {
		CreateLayer: function(historyItem) {
			ave.edit.RemoveLayer( historyItem.layer);
			historyItem.layer.Remove( historyItem.index, historyItem.parent);
		},
		
		CreateGroup: function(historyItem) {
			var _list = historyItem.hierarchyList;
			for(var ind=_list.length-1; ind>-1; ind--) {
				_list[ind].item.Remove();
				_list[ind].item.InsertTo( _list[ind].index, _list[ind].parent);
			}
			
			var _group = historyItem.newGroup;
			
			ave.edit.RemoveGroup(_group);
			_group.Remove();
		},
		
		RemoveHierarchyItems: function(historyItem) {
			var _list = historyItem.hierarchyList;
			for(var ind=_list.length-1; ind>-1; ind--) {
				_list[ind].element.InsertTo( _list[ind].index, _list[ind].parent);
				
				switch(_list[ind].element.type) {
				case 'Group':
					ave.edit.AddGroup( _list[ind].element);
					break;
				case 'Layer':
					ave.edit.AddLayer( _list[ind].element);
					break;
				}
			}
			
			var _list = historyItem.layerItemsList;
			for(var key in _list) {
				var _layer = ave.layersList.items[key];
				for(var ind=0, len=_list[key].length; ind<len; ind++) {
					var _layerItem = _list[key][ind];
					
					_layer.InsertItemBefore( _layerItem.index, _layerItem.item);
					ave.edit.AddItem( _layer.id, _layerItem.index);
				}
				_layer._PathBuild();
			}
			
		},
	
		SwapHierarchyItems: function(historyItem) {
			var _list = historyItem.hierarchyList;
			for(var ind=0, len=_list.length; ind<len; ind++) {
				_list[ind].item.Remove();
			}
			
			for(var ind=0, len=_list.length; ind<len; ind++) {
				_list[ind].item.InsertTo( _list[ind].index, _list[ind].parent);
			}
		},
		
		CloseLayer: function(historyItem) {
			historyItem.layer.isClosed = false;
			historyItem.layer._PathBuild();
		},
		
		CreateLayerItem: function(historyItem) {
			historyItem.itemsList.forEach( function( _elem) {
				if( _elem.type
					&& _elem.type == 'closeLayer'
				) {
					_elem.layer.isClosed = false;
					_elem.layer._PathBuild();
				} else {
					_elem.layer.RemoveItem( _elem.item);
					_elem.layer._PathBuild();
				}
			});
		},
		
		LayerInsertItemBefore: function(historyItem) {
			var _layer = historyItem.layer;
			var _item = historyItem.item;
			
			ave.edit.RemoveItem( _item);
			_layer.RemoveItem( _item);
			_layer._PathBuild();
		},
		
		LayerItemRemove: function(historyItem) {
			var _layer = historyItem.layer;
			var _item = historyItem.item;
			var _index = historyItem.index;
			
			_layer.InsertItemBefore( _index, _item);
			_layer._PathBuild();
			_item.RewritePath();
			if( _index == _layer.items.length-1) {
				if( _layer.isClosed) {
					_layer.items[0].RewritePath();
				}
			} else {
				_layer.items[_item._index+1].RewritePath();
			}
			
			ave.edit.RemoveItemsInLayer( _layer);
			ave.edit.AddItem( _item);
		},
		
		LayerItemsMove: function(historyItem) {
			var _items = historyItem.itemsList;
			for(var key in _items) {
				_items[key].forEach(function(_historyItem) {
					_historyItem.item.points[0].MoveTo(
						_historyItem.before.x,
						_historyItem.before.y
					);
				});
				
				ave.layersList.items[key]._PathBuild();
				
			}
		},
		
		LayerItemsCurve: function(historyItem) {
			historyItem.itemsList.forEach(function(elem) {
				for(var ind=2; ind>0; ind--) {
					if( elem.before['x'+ind]) {
						elem.item.points[ind].isActive = true;
						elem.item.points[ind].MoveTo(
							elem.before['x'+ind],
							elem.before['y'+ind]
						);
					} else {
						elem.item.points[ind].isActive = false;
					}
				}
				elem.item._parent._PathBuild();
			});
		},
			
		Fill: function(historyItem) {
			var _list = historyItem.list;
			var _item;
			for(var i=0, len=_list.length; i<len; i++) {
				_item = _list[i];
				
				_item.item.style.fill = _item.before;
			}
		},
		
		Stroke: function(historyItem) {
			var _list = historyItem.list;
			var _item;
			for(var i=0, len=_list.length; i<len; i++) {
				_item = _list[i];
				
				_item.item.style.stroke = _item.before;
			}
		},
		
		StrokeWidth: function(historyItem) {
			var _list = historyItem.list;
			var _item;
			for(var i=0, len=_list.length; i<len; i++) {
				_item = _list[i];
				_item.item.style.strokeWidth = _item.before;
			}
			
			
			var _newList = {};
			
			var _list = historyItem.list;
			var _val;
			
			
			_list.forEach( function( item) {
				_item = item.item;
				_val = item.before;
				
				_item.style.strokeWidth = _val;
				
				if( !_newList[_val]) {
					_newList[_val] = {};
				}
				
				_newList[_val][_item.id] = _item;
			});
			
			ave.edit.graphic.strokeWidth._list = _newList;
			ave.edit.graphic.strokeWidth._Rewrite();
		},
		
		CreateLayerItemAnimPath: function(historyItem) {
			historyItem.layerItemAnimPath.RemoveAnimPath();
		},
		
		ReFramePoint: function(historyItem) {
			var _layerItemPoint = historyItem.frame._parent._parent;
			var _layerItem = _layerItemPoint._parent;
			
			if( historyItem.before) {
				historyItem.frame.points[0].MoveTo( historyItem.before.x, historyItem.before.y);
				_layerItemPoint.animPath._PathBuild();
				_layerItem.animPath.ReFrames();
			} else {
				_layerItemPoint.animPath.RemoveFrame(historyItem.frame._index);
			}
			
			switch(_layerItemPoint._index) {
			case 0:
				_layerItem.animPath.nodes.svgLine.main.removeChild(historyItem.frame.nodes.timelinePoint);
				break;
			case 1:
				_layerItem.animPath.nodes.svgLine.sup1.removeChild(historyItem.frame.nodes._timelinePoint);
				break;
			case 2:
				_layerItem.animPath.nodes.svgLine.sup2.removeChild(historyItem.frame.nodes._timelinePoint);
				break;
			}
			
			ave.animation.ClickTimeline();
		},
		
		FrameMove: function(historyItem) {
			var _frame = historyItem.frame;
			var _itemPoint = _frame._parent._parent;
			var _layerItem = _itemPoint._parent;
			
			_frame.Reorder(historyItem.before);
						
			_itemPoint.animPath._PathBuild();
			_layerItem.animPath.ReFrames();
			ave.animation.ClickTimeline();
		},
		
		ReFrameAllPoints: function(historyItem) {
			historyItem.points.forEach(function(elem, ind) {
				var _layerItemPoint = elem.frame._parent._parent;
				var _layerItem = _layerItemPoint._parent;
				
				if( elem.before) {
					elem.frame.points[0].MoveTo( elem.before.x, elem.before.y);
					_layerItemPoint.animPath._PathBuild();
					_layerItem.animPath.ReFrames();
				} else {
					_layerItemPoint.animPath.RemoveFrame(elem.frame._index);
				}

			});
			
			ave.animation.ClickTimeline();
		},
		
		FramePointMove: function(historyItem) {
			historyItem.frame.points[0].MoveTo( historyItem.before.x, historyItem.before.y);
			
			var _point = historyItem.frame._parent._parent;
			_point.animPath._PathBuild();
			
			var _layerItem = _point._parent;
			_layerItem.animPath.ReFrames();
			
			ave.animation.ClickTimeline();
			
		},
		
		FramePointCurves: function(historyItem) {
			if( historyItem.before.x1) {
				historyItem.frame.points[1].MoveTo( historyItem.before.x1, historyItem.before.y1);
			} else {
				historyItem.frame.points[1].isActive = false;
			}
			
			if( historyItem.before.x2) {
				historyItem.frame.points[2].MoveTo( historyItem.before.x2, historyItem.before.y2);
			} else {
				historyItem.frame.points[2].isActive = false;
			}
				
			var _point = historyItem.frame._parent._parent;
			_point.animPath._PathBuild();
			
			var _layerItem = _point._parent;
			_layerItem.animPath.ReFrames();
			
			ave.animation.ClickTimeline();
			
		},
		
		RemoveFrame: function(historyItem) {
			var _layerItemPoint = historyItem.frame._parent._parent;
			var _layerItem = _layerItemPoint._parent;
			
			switch(_layerItemPoint._index) {
			case 0:
				_layerItem.animPath.nodes.svgLine.main.appendChild(historyItem.frame.nodes.timelinePoint);
				break;
			case 1:
				_layerItem.animPath.nodes.svgLine.sup1.appendChild(historyItem.frame.nodes._timelinePoint);
				break;
			case 2:
				_layerItem.animPath.nodes.svgLine.sup2.appendChild(historyItem.frame.nodes._timelinePoint);
				break;
			}
			
			_layerItemPoint.animPath.nodes.svgLabels.appendChild(historyItem.frame.nodes.group);
			_layerItemPoint.animPath.frames[historyItem.frame._index] = historyItem.frame;
			
			_layerItemPoint.animPath._PathBuild();
			_layerItem.animPath.ReFrames();
			ave.animation.ClickTimeline();
		},
	
		TransformRotate: function(historyItem) {
			for(var layerKey in historyItem.itemsList) {
				historyItem.itemsList[layerKey].forEach(function(item) {
					item.point.MoveTo(
						item.before.x,
						item.before.y
					);
				});
				
				ave.layersList.items[layerKey]._PathBuild();
			}
			
		},
		
	},
	
	Cancel: function() {
		if( this.items.length == 0) { return; }
		
		var _historyItem;
		
		for(var ind=this.items.length-1; ind>-1; ind--) {
			if( this.items[ind].isActive) {
				_historyItem = this.items[ind];
				break;
			}
		}
		
		if( !_historyItem) { return; }
		switch(_historyItem.type) {
		case 'createLayer':
			this.cancel.CreateLayer(_historyItem);
			break;
		case 'createGroup':
			this.cancel.CreateGroup(_historyItem);
			break;
		case 'removeHierarchyItems':
			this.cancel.RemoveHierarchyItems(_historyItem);
			break;
		case 'swapHierarchyItems':
			this.cancel.SwapHierarchyItems(_historyItem);
			break;
		case 'closeLayer':
			this.cancel.CloseLayer(_historyItem);
			break;
		case 'createLayerItem':
			this.cancel.CreateLayerItem(_historyItem);
			break;
		case 'layerInsertItemBefore':
			this.cancel.LayerInsertItemBefore(_historyItem);
			break;
		case 'layerItemRemove':
			this.cancel.LayerItemRemove(_historyItem);
			break;
		case 'layerItemsMove':
			this.cancel.LayerItemsMove(_historyItem);
			break;
		case 'layerItemsCurve':
			this.cancel.LayerItemsCurve(_historyItem);
			break;
		case 'fill':
			this.cancel.Fill(_historyItem);
			break;
		case 'stroke':
			this.cancel.Stroke(_historyItem);
			break;
		case 'strokeWidth':
			this.cancel.StrokeWidth(_historyItem);
			break;
		case 'createLayerItemAnimPath':
			this.cancel.CreateLayerItemAnimPath(_historyItem);
			break;
		case 'reFramePoint':
			this.cancel.ReFramePoint(_historyItem);
			break;
		case 'frameMove':
			this.cancel.FrameMove(_historyItem);
			break;
		case 'reFrameAllPoints':
			this.cancel.ReFrameAllPoints(_historyItem);
			break;
		case 'framePointMove':
			this.cancel.FramePointMove(_historyItem);
			break;
		case 'framePointCurves':
			this.cancel.FramePointCurves(_historyItem);
			break;
		case 'removeFrame':
			this.cancel.RemoveFrame(_historyItem);
			break;
		case 'transformRotate':
			this.cancel.TransformRotate(_historyItem);
			break;
		default:
			console.error('History type is undefined.');
			return;
		}
		
		_historyItem.isActive = false;
	},
	
	repeat: {
		CreateLayer: function(historyItem) {
			historyItem.layer.InsertTo( historyItem.index, historyItem.parent);
			ave.edit.SelectOneLayer( historyItem.layer);
		},
		
		CreateGroup: function(historyItem) {
			var _group = historyItem.newGroup;
			var _list = historyItem.hierarchyList;
			
			if( _list.length != 0) {
				var _isFirst = true;
				_list.forEach( function( _elem) {
					if( _isFirst) {
						_group.InsertTo(_elem.index, _elem._parent);
						_isFirst = false;
					}
					
					_elem.item.Remove();
					_elem.item.InsertTo( _group.items.length, _group);
				});
			} else {
				_group.InsertTo(0);
			}
			
			ave.edit.SelectOneGroup(_group);
			
		},
		
		RemoveHierarchyItems: function(historyItem) {
			// Layers and Group
			var _list = historyItem.hierarchyList;
			for(var i=0, len=_list.length; i<len; i++) {
				var _item = _list[i];
				
				switch(_item.element.type) {
				case 'Group':
					ave.edit.RemoveGroup( _item.element);
					ave.groupsList.Remove( _item.element.id);
					break;
				case 'Layer':
					ave.edit.RemoveItemsInLayer( _item.element);
					ave.edit.RemoveLayer( _item.element);
					ave.layersList.Remove( _item.element.id);
					break;
				}
				
			}
			
			// LayerItems
			var _list = historyItem.layerItemsList;
			for(var key in _list) {
				var _layer = ave.layersList.items[key];
				for(var ind=0, len=_list[key].length; ind<len; ind++) {
					var _layerItem = _list[key][ind];
					ave.edit.RemoveItem( key, _layerItem.index);
					_layer.RemoveItem(_layerItem.item);
				}
				_layer._PathBuild();
			}
			
		},
	
		SwapHierarchyItems: function(historyItem) {
			var _list = historyItem.hierarchyList;
			for(var ind=_list.length-1; ind>-1; ind--) {
				_list[ind].item.Remove();
				_list[ind].item.InsertTo( historyItem.newIndex, historyItem.newParent);
			}
		},
		
		CloseLayer: function(historyItem) {
			historyItem.layer.isClosed = true;
			historyItem.layer._PathBuild();
		},
		
		CreateLayerItem: function(historyItem) {
			historyItem.itemsList.forEach( function( _elem) {
				if( _elem.type
					&& _elem.type == 'closeLayer'
				) {
					_elem.layer.isClosed = true;
					_elem.layer._PathBuild();
					
					ave.edit.RemoveItemsInLayer( _elem.layer);
					ave.edit.AddItem( _elem.layer.items[0]);
				} else {
					_elem.layer.AppendItem( _elem.item);
					_elem.layer._PathBuild();
					
					ave.edit.RemoveItemsInLayer( _elem.layer);
					ave.edit.AddItem( _elem.item);
				}
			});
		},
		
		LayerInsertItemBefore: function(historyItem) {
			var _layer = historyItem.layer;
			var _item = historyItem.item;
			
			if( historyItem.index == 0) {
				historyItem.layer.AppendItem(_item);
			} else {
				_layer.InsertItemBefore( historyItem.index, _item);
			}
			
			_layer._PathBuild();
			
			_item.RewritePath();
			if( _item._index == _layer.items.length-1) {
				if( _layer.isClosed) {
					_layer.items[0].RewritePath();
				}
			} else {
				_layer.items[_item._index+1].RewritePath();
			}
			
			ave.edit.RemoveItemsInLayer( _layer);
			ave.edit.AddItem( _item);
		},
	
		LayerItemRemove: function(historyItem) {
			var _layer = historyItem.layer;
			var _item = historyItem.item;
			// var _index = historyItem.index;
			
			ave.edit.RemoveItem( _item);
			_layer.RemoveItem(_item);
			_layer._PathBuild();
		},
		
		LayerItemsMove: function(historyItem) {
			var _items = historyItem.itemsList;
			for(var key in _items) {
				_items[key].forEach(function(_historyItem) {
					_historyItem.item.points[0].MoveTo(
						_historyItem.after.x,
						_historyItem.after.y
					);
				});
				
				ave.layersList.items[key]._PathBuild();
				
			}
		},
		
		LayerItemsCurve: function(historyItem) {
			historyItem.itemsList.forEach(function(elem) {
				for(var ind=2; ind>0; ind--) {
					if( elem.after['x'+ind]) {
						elem.item.points[ind].isActive = true;
						elem.item.points[ind].MoveTo(
							elem.after['x'+ind],
							elem.after['y'+ind]
						);
					} else {
						elem.item.points[ind].isActive = false;
					}
					
				}
				elem.item._parent._PathBuild();
			});
		},
		
		Fill: function(historyItem) {
			var _list = historyItem.list;
			for(var i=0, len=_list.length; i<len; i++) {
				_list[i].item.style.fill = historyItem.after;
			}
		},
		
		Stroke: function(historyItem) {
			var _list = historyItem.list;
			for(var i=0, len=_list.length; i<len; i++) {
				_list[i].item.style.stroke = historyItem.after;
			}
		},
		
		StrokeWidth: function(historyItem) {
			var _newList = {};
			
			var _list = historyItem.list;
			var _val = historyItem.after;
			var _item;
			
			_newList[_val] = {}
			
			_list.forEach( function( item) {
				_item = item.item;
				
				_item.style.strokeWidth = _val;
				
				_newList[_val][_item.id] = _item;
			});
			
			ave.edit.graphic.strokeWidth._list = _newList;
			ave.edit.graphic.strokeWidth._Rewrite();
		},
		
		CreateLayerItemAnimPath: function(historyItem) {
			var _layerItem = historyItem.layerItemAnimPath._parent;
			var _sceneGroups = ave.bars.scene.workSpace.children;
			
			_layerItem.animPath = historyItem.layerItemAnimPath;
			
			
			_layerItem.points.forEach(function(point, ind) {
				point.animPath = historyItem.layerItemPointsAnimPath[ind];
				
				_sceneGroups.svgAnimPath.appendChild( point.animPath.nodes.svgAnimPath);
				_sceneGroups.svgAnimLabels.appendChild( point.animPath.nodes.svgLabels);
			});
			
			ave.bars.animation.blockLeft.children.itemsList.appendChild(historyItem.layerItemAnimPath.nodes.animList.itemArea);
			ave.bars.animation.blockRight.children.itemsArea.appendChild(historyItem.layerItemAnimPath.nodes.svgLine.group);
			
			_layerItem.animPath.ReFrames();
			ave.animation.ClickTimeline();
			
		},
		
		ReFramePoint: function(historyItem) {
			var _layerItemPoint = historyItem.frame._parent._parent;
			var _layerItem = _layerItemPoint._parent;
			
			if( historyItem.before) {
				historyItem.frame.points[0].MoveTo( historyItem.after.x, historyItem.after.y);
			} else {
				_layerItemPoint.animPath.nodes.svgLabels.appendChild(historyItem.frame.nodes.group);
				_layerItemPoint.animPath.frames[historyItem.frame._index] = historyItem.frame;
			}
			
			switch(_layerItemPoint._index) {
			case 0:
				_layerItem.animPath.nodes.svgLine.main.appendChild(historyItem.frame.nodes.timelinePoint);
				break;
			case 1:
				_layerItem.animPath.nodes.svgLine.sup1.appendChild(historyItem.frame.nodes._timelinePoint);
				break;
			case 2:
				_layerItem.animPath.nodes.svgLine.sup2.appendChild(historyItem.frame.nodes._timelinePoint);
				break;
			}
			
			_layerItemPoint.animPath._PathBuild();
			_layerItem.animPath.ReFrames();
			ave.animation.ClickTimeline();
		},
		
		FrameMove: function(historyItem) {
			var _frame = historyItem.frame;
			var _itemPoint = _frame._parent._parent;
			var _layerItem = _itemPoint._parent;
			
			_frame.Reorder(historyItem.after);
						
			_itemPoint.animPath._PathBuild();
			_layerItem.animPath.ReFrames();
			ave.animation.ClickTimeline();
		},
		
		ReFrameAllPoints: function(historyItem) {
			historyItem.points.forEach(function(elem, ind) {
				var _layerItemPoint = elem.frame._parent._parent;
				var _layerItem = _layerItemPoint._parent;
				
				if( elem.before) {
					elem.frame.points[0].MoveTo( elem.after.x, elem.after.y);
				} else {
					_layerItemPoint.animPath.nodes.svgLabels.appendChild(elem.frame.nodes.group);
					_layerItemPoint.animPath.frames[elem.frame._index] = elem.frame;
				}
				
				_layerItemPoint.animPath._PathBuild();
				_layerItem.animPath.ReFrames();

			});
			
			ave.animation.ClickTimeline();
		},
	
		FramePointMove: function(historyItem) {
			historyItem.frame.points[0].MoveTo( historyItem.after.x, historyItem.after.y);
			
			var _point = historyItem.frame._parent._parent;
			_point.animPath._PathBuild();
			
			var _layerItem = _point._parent;
			_layerItem.animPath.ReFrames();
			
			ave.animation.ClickTimeline();
		},
		
		FramePointCurves: function(historyItem) {
			if( historyItem.after.x1) {
				historyItem.frame.points[1].isActive = true;
				historyItem.frame.points[1].MoveTo( historyItem.after.x1, historyItem.after.y1);
			} else {
				historyItem.frame.points[1].isActive = false;
			}
			
			if( historyItem.after.x2) {
				historyItem.frame.points[2].isActive = true;
				historyItem.frame.points[2].MoveTo( historyItem.after.x2, historyItem.after.y2);
			} else {
				historyItem.frame.points[2].isActive = false;
			}
				
			var _point = historyItem.frame._parent._parent;
			_point.animPath._PathBuild();
			
			var _layerItem = _point._parent;
			_layerItem.animPath.ReFrames();
			
			ave.animation.ClickTimeline();
		},
		
		RemoveFrame: function(historyItem) {
			var _layerItemPoint = historyItem.frame._parent._parent;
			var _layerItem = _layerItemPoint._parent;
			
			switch(_layerItemPoint._index) {
			case 0:
				_layerItem.animPath.nodes.svgLine.main.removeChild(historyItem.frame.nodes.timelinePoint);
				break;
			case 1:
				_layerItem.animPath.nodes.svgLine.sup1.removeChild(historyItem.frame.nodes._timelinePoint);
				break;
			case 2:
				_layerItem.animPath.nodes.svgLine.sup2.removeChild(historyItem.frame.nodes._timelinePoint);
				break;
			}
			
			_layerItemPoint.animPath.RemoveFrame(historyItem.frame._index);
			ave.animation.ClickTimeline();
		},
	
		TransformRotate: function(historyItem) {
			for(var layerKey in historyItem.itemsList) {
				historyItem.itemsList[layerKey].forEach(function(item) {
					item.point.MoveTo(
						item.after.x,
						item.after.y
					);
				});
				
				ave.layersList.items[layerKey]._PathBuild();
			}
		},
		
	},
	
	Repeat: function() {
		if( this.items.length == 0) { return; }
		
		var _historyItem;
		
		for(var ind=this.items.length-1; ind>-1; ind--) {
			if( !this.items[ind].isActive) {
				_historyItem = this.items[ind];
			} else {
				break;
			}
		}
		
		if( !_historyItem) { return; }
		
		switch(_historyItem.type) {
		case 'createLayer':
			this.repeat.CreateLayer(_historyItem);
			break;
		case 'createGroup':
			this.repeat.CreateGroup(_historyItem);
			break;
		case 'removeHierarchyItems':
			this.repeat.RemoveHierarchyItems(_historyItem);
			break;
		case 'swapHierarchyItems':
			this.repeat.SwapHierarchyItems(_historyItem);
			break;
		case 'closeLayer':
			this.repeat.CloseLayer(_historyItem);
			break;
		case 'createLayerItem':
			this.repeat.CreateLayerItem(_historyItem);
			break;
		case 'layerInsertItemBefore':
			this.repeat.LayerInsertItemBefore(_historyItem);
			break;
		case 'layerItemRemove':
			this.repeat.LayerItemRemove(_historyItem);
			break;
		case 'layerItemsMove':
			this.repeat.LayerItemsMove(_historyItem);
			break;
		case 'layerItemsCurve':
			this.repeat.LayerItemsCurve(_historyItem);
			break;
		case 'fill':
			this.repeat.Fill(_historyItem);
			break;
		case 'stroke':
			this.repeat.Stroke(_historyItem);
			break;
		case 'strokeWidth':
			this.repeat.StrokeWidth(_historyItem);
			break;
		case 'createLayerItemAnimPath':
			this.repeat.CreateLayerItemAnimPath(_historyItem);
			break;
		case 'reFramePoint':
			this.repeat.ReFramePoint(_historyItem);
			break;
		case 'frameMove':
			this.repeat.FrameMove(_historyItem);
			break;
		case 'reFrameAllPoints':
			this.repeat.ReFrameAllPoints(_historyItem);
			break;
		case 'framePointMove':
			this.repeat.FramePointMove(_historyItem);
			break;
		case 'framePointCurves':
			this.repeat.FramePointCurves(_historyItem);
			break;
		case 'removeFrame':
			this.repeat.RemoveFrame(_historyItem);
			break;
		case 'transformRotate':
			this.repeat.TransformRotate(_historyItem);
			break;
		default:
			console.error('History type is undefined.');
			return;
		}
		
		_historyItem.isActive = true;
	},
	
	items: []
};
})();